// api/Routes/userRoute.js
import express from 'express';
import { user } from '../Controlles/userController.js';

const router = express.Router();

router.get('/user', user);

export default router;
