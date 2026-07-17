import express from 'express';
import { getCurrentReminder } from '../controllers/device.controller.js';

const router = express.Router();

router.get('/reminders/current', getCurrentReminder);

export default router;
