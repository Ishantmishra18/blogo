import express from 'express';
import {getData} from '../controllers/adminCon.js';

import { protect } from '../middlewares/authMiddle.js';

const router = express.Router();

router.get('/data', getData);


export default router;