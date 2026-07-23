import express from 'express';
import { getAIWarnings } from '../controllers/aiot.controller.js';

const router = express.Router();

router.get('/warnings', getAIWarnings);

export default router;
