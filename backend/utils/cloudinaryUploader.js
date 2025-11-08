import { v2 as cloudinary } from 'cloudinary';

// This helper function can be imported anywhere
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder ,
        resource_type: "auto"
      }, // We can specify a folder
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

export default uploadToCloudinary;