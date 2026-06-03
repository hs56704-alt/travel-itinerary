import axiosInstance from '../utils/axiosInstance';

export const uploadDocumentsAPI = (formData) =>
  axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getDocumentsAPI  = ()    => axiosInstance.get('/upload');
export const deleteDocumentAPI = (id) => axiosInstance.delete(`/upload/${id}`);