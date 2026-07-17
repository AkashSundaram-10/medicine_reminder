import { getMedicinesByDate } from '../services/medicine.service.js';

export const getDashboardData = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0]; 
    const medicinesForDate = await getMedicinesByDate(date);
    
    res.json({
      date,
      totalScheduled: medicinesForDate.length,
      taken: medicinesForDate.filter(m => m.taken).length,
      pending: medicinesForDate.filter(m => !m.taken).length,
      medicines: medicinesForDate
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
