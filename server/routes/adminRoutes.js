import express from 'express';
import {getData} from '../controllers/adminCon.js';

import { protect } from '../middlewares/authMiddle.js';
import {deleteFile,} from '../controllers/fileCon.js';
import { deleteUser } from '../controllers/adminCon.js';

const router = express.Router();

router.get('/data', getData);
router.delete('/delete-file/:id', deleteFile);
router.delete('/delete-user/:id', deleteUser);


export default router;