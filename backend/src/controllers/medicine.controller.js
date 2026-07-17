import * as MedicineService from '../services/medicine.service.js';

export const getMedicines = async (req, res) => {
  try {
    const medicines = await MedicineService.getAllMedicines();
    res.json(medicines);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const createMedicine = async (req, res) => {
  try {
    const newMed = await MedicineService.createMedicine(req.body);
    res.status(201).json(newMed);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const updatedMed = await MedicineService.updateMedicine(req.params.id, req.body);
    if (!updatedMed) return res.status(404).json({ message: 'Not found' });
    res.json(updatedMed);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const deletedMed = await MedicineService.deleteMedicine(req.params.id);
    if (!deletedMed) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
