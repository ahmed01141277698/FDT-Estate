import express from 'express';
import { uploadImages } from '../Controlles/uploadController.js';
import upload from '../Middleware/upload.js';

const router = express.Router();

router.post('/', upload.array('images', 7), uploadImages);

export default router;