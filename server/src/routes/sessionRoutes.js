import { Router } from 'express';
import multer from 'multer';
import {
  startSession,
  submitAnswer,
  finishSession,
  getSession,
} from '../controllers/sessionController.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB máximo
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se admiten archivos PDF para la carga de CV.'));
    }
  },
});

function handleOptionalPdfUpload(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    upload.single('cvFile')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return next();
    });
  } else {
    next();
  }
}

router.post('/start', handleOptionalPdfUpload, startSession);
router.post('/answer', submitAnswer);
router.post('/finish', finishSession);
router.get('/:id', getSession);

export default router;
