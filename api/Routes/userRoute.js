import express from 'express';
import multer from 'multer';
import path from 'path';
import { getProfile, updateProfile, deleteProfile, uploadAvatar } from '../Controlles/userController.js';
import { verifyToken } from '../Middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'api/uploads/avatars/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.userId}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('صور فقط'));
  },
});

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.delete('/profile', verifyToken, deleteProfile);
router.post('/profile/avatar', verifyToken, upload.single('avatar'), uploadAvatar);

export default router;