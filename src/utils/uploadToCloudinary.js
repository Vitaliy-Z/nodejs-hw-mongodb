import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadToCloudinary = (filePath) =>
  cloudinary.uploader.upload(filePath);

export const removeInCloudinary = (filePath) => {
  const photoId = filePath.split('/').at(-1).split('.')[0];

  console.log(' photoId:', photoId);

  return cloudinary.uploader.destroy(photoId);
};
