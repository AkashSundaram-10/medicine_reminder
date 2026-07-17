import { getMedicinesByDate } from '../services/medicine.service.js';

export const getCurrentReminder = async (req, res) => {
  const token = req.get('X-Device-Token');

  if (!process.env.DEVICE_API_TOKEN || token !== process.env.DEVICE_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized device' });
  }

  const { date, time } = req.query;
  if (!date || !time) {
    return res.status(400).json({ error: 'Both date and time are required' });
  }

  try {
    const medicines = await getMedicinesByDate(date);
    const medicine = medicines.find(item => item.time === time && !item.taken) || null;

    res.json({ due: Boolean(medicine), medicine });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
