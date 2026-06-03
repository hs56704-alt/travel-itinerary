import axiosInstance from '../utils/axiosInstance';

export const generateItineraryAPI    = (documentIds)  => axiosInstance.post('/itinerary/generate', { documentIds });
export const getItinerariesAPI       = ()              => axiosInstance.get('/itinerary');
export const getItineraryAPI         = (id)            => axiosInstance.get(`/itinerary/${id}`);
export const getSharedItineraryAPI   = (shareToken)    => axiosInstance.get(`/itinerary/share/${shareToken}`);
export const toggleShareAPI          = (id)            => axiosInstance.patch(`/itinerary/${id}/share`);