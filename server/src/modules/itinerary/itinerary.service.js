import Document from '../upload/document.model.js';
import Itinerary from './itinerary.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { extractDocumentData } from '../../services/extraction.service.js';
import { generateItinerary as generateFromAI } from '../../services/generation.service.js';

export const generateItinerary = async (userId, documentIds) => {
  
  const documents = await Document.find({ _id: { $in: documentIds }, userId });

  if (!documents.length) {
    throw new AppError('No valid documents found', 400);
  }

  
  const extractedDataList = [];

  for (const doc of documents) {
  const { rawText, extractedData } = await extractDocumentData(doc);

  await Document.findByIdAndUpdate(doc._id, {
    extractedText: rawText,
    extractedData,
    status: 'processed',
  });

  extractedDataList.push(extractedData);
}

  if (!extractedDataList.length) {
    throw new AppError('Could not extract data from any document', 400);
  }

  
  const generatedContent = await generateFromAI(extractedDataList);

  
  const itinerary = await Itinerary.create({
    userId,
    documents: documentIds,
    title: generatedContent.title,
    destination: generatedContent.destination,
    startDate: generatedContent.startDate || null,
    endDate: generatedContent.endDate || null,
    generatedContent,
  });

  return itinerary;
};

export const getUserItineraries = async (userId) => {
  return Itinerary.find({ userId })
    .select('title destination startDate endDate isPublic shareToken createdAt')
    .sort({ createdAt: -1 });
};

export const getItineraryById = async (id, userId) => {
  const itinerary = await Itinerary.findOne({ _id: id, userId }).populate(
    'documents',
    'originalFileName fileType fileUrl status'
  );

  if (!itinerary) throw new AppError('Itinerary not found', 404);
  return itinerary;
};

export const getSharedItinerary = async (shareToken) => {
  const itinerary = await Itinerary.findOne({ shareToken, isPublic: true });
  if (!itinerary) throw new AppError('This itinerary is not available', 404);
  return itinerary;
};

export const toggleShare = async (id, userId) => {
  const itinerary = await Itinerary.findOne({ _id: id, userId });
  if (!itinerary) throw new AppError('Itinerary not found', 404);

  itinerary.isPublic = !itinerary.isPublic;
  await itinerary.save();

  return {
    isPublic: itinerary.isPublic,
    shareToken: itinerary.shareToken,
    shareUrl: itinerary.isPublic
      ? `${process.env.CLIENT_URL}/share/${itinerary.shareToken}`
      : null,
  };
};