import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(' req:', req.body);
    cb(null, path.resolve('src', 'tmp'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + req.body.name + file.originalname);
  },
});

export const upload = multer({ storage: storage });
