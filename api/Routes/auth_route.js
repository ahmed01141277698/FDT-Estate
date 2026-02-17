import express from 'express';
import { signUp } from '../Controlles/auth_controll.js';

const router = express.Router();

router.post('/signUp', signUp);

export default router;
