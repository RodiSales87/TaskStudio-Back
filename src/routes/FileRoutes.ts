import { Router } from 'express';
import multer from 'multer';
import auth from '../middlewares/auth';
import FileController from '../controllers/fileController';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const FileRouter = Router();

FileRouter.route('/task/:taskId').post(
  [auth, upload.single('file')], 
  FileController.upload
);

FileRouter.route('/attachment/:attachmentId').delete(
    [auth], 
    FileController.delete
);

export default FileRouter;