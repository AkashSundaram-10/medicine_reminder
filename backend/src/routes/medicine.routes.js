import express from 'express';
import { getMedicines, createMedicine, updateMedicine, deleteMedicine } from '../controllers/medicine.controller.js';

const router = express.Router();

router.get('/', getMedicines);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

export default router;
