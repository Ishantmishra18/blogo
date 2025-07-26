import express from 'express';
import { register, login, logout  , getMe , getHistory} from '../controllers/authCon.js';

import { protect } from '../middlewares/authMiddle.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',protect ,  logout);
router.get('/me', protect, getMe);
router.get('/history' , protect , getHistory);

export default router;