import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../../config/aws.js';
import Document from './document.model.js';
import { AppError } from '../../middlewares/error.middleware.js';

export const saveDocument = async ({ userId, file }) => {
  const fileType = file.mimetype === 'application/pdf' ? 'pdf' : 'image';

  const document = await Document.create({
    userId,
    fileUrl: file.location,  
    fileKey: file.key,        
    fileType,
    originalFileName: file.originalname,
    status: 'uploaded',
  });

  return document;
};

export const getUserDocuments = async (userId) => {
  return Document.find({ userId }).sort({ createdAt: -1 });
};

export const deleteDocument = async (documentId, userId) => {
  const document = await Document.findOne({ _id: documentId, userId });

  if (!document) {
    throw new AppError('Document not found', 404);
  }

  
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: document.fileKey,
    })
  );

  
  await document.deleteOne();
};