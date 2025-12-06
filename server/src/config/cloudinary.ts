import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary


// Upload buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer: Buffer): Promise<string> => {

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'pieces' }, // optional folder name
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default cloudinary;
