import express from 'express';
import { getProfile, updateProfile, deleteProfile, uploadAvatar ,getUserById } from '../Controlles/userController.js';
import { verifyToken } from '../Middleware/authMiddleware.js';
import upload from "../Middleware/upload.js";
const router = express.Router();


router.get('/profile', verifyToken, getProfile);
router.get('/:id', getUserById);
router.put('/profile', verifyToken, updateProfile);
router.delete('/profile', verifyToken, deleteProfile);
router.post('/profile/avatar', verifyToken, upload.single('avatar'), uploadAvatar);

export default router;