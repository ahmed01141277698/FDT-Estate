import express from 'express';
import { signUp , signIn} from '../Controlles/auth_controll.js';

const router = express.Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);

export default router;
