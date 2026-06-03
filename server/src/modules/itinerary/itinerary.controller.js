import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import {
  generateItinerary,
  getUserItineraries,
  getItineraryById,
  getSharedItinerary,
  toggleShare,
} from './itinerary.service.js';


export const generate = asyncHandler(async (req, res) => {
  const { documentIds } = req.body;
  if (!documentIds?.length) {
    return res.status(400).json({ success: false, message: 'documentIds array is required' });
  }
  const itinerary = await generateItinerary(req.user._id, documentIds);
  successResponse(res, 'Itinerary generated successfully', { itinerary }, 201);
});


export const getAll = asyncHandler(async (req, res) => {
  const itineraries = await getUserItineraries(req.user._id);
  successResponse(res, 'Itineraries fetched', { itineraries });
});


export const getOne = asyncHandler(async (req, res) => {
  const itinerary = await getItineraryById(req.params.id, req.user._id);
  successResponse(res, 'Itinerary fetched', { itinerary });
});


export const getShared = asyncHandler(async (req, res) => {
  const itinerary = await getSharedItinerary(req.params.shareToken);
  successResponse(res, 'Shared itinerary fetched', { itinerary });
});


export const share = asyncHandler(async (req, res) => {
  const result = await toggleShare(req.params.id, req.user._id);
  const message = result.isPublic ? 'Itinerary is now public' : 'Itinerary is now private';
  successResponse(res, message, result);
});