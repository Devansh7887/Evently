import multer from 'multer';

// --- UPLOADER SIRF IMAGES KE LIYE ---
const imageStorage = multer.memoryStorage();
const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    // Sirf images ko allow karein
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
});

// --- NAYA UPLOADER SIRF FILES (Resumes) KE LIYE ---
const fileStorage = multer.memoryStorage();
const fileUpload = multer({
  storage: fileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    // PDF aur Word documents ko allow karein
    console.log('--- RESUME FILE FILTER ---');
    console.log('File received:', file.originalname);
    console.log('Mimetype:', file.mimetype);
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype.trim())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only PDF or DOC/DOCX are allowed.'), false);
    }
  },
});

// --- EXPORTS ---

// Events ke liye (2 images)
export const uploadEventImages = imageUpload.fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'venueImage', maxCount: 1 }
]);

// Team/Gallery ke liye (1 image)
export const uploadSingleImage = imageUpload.fields([
  { name: 'image', maxCount: 1 },
]);

// NAYA EXPORT: Resumes ke liye (1 file)
export const uploadResumeFile = fileUpload.fields([
  { name: 'resume', maxCount: 1 } // Hum file ko 'resume' naam ke field mein expect karenge
]);