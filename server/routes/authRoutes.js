import express from 'express';
import { register, login, logout  , getMe} from '../controllers/authCon.js';

import { protect } from '../middlewares/authMiddle.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;