import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { saveDocument, getUserDocuments, deleteDocument } from './upload.service.js';


export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const documents = await Promise.all(req.files.map(file => saveDocument({ userId: req.user._id, file })));

  successResponse(res, 'Documents uploaded successfully', { documents }, 201);
});


export const getDocuments = asyncHandler(async (req, res) => {
  const documents = await getUserDocuments(req.user._id);
  successResponse(res, 'Documents fetched', { documents });
});


export const removeDocument = asyncHandler(async (req, res) => {
  await deleteDocument(req.params.id, req.user._id);
  successResponse(res, 'Document deleted successfully');
});