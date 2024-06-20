import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB file size limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true); 
    } else {
      cb(new Error('Only PDF files are allowed')); 
    }
  },
});

export default upload;