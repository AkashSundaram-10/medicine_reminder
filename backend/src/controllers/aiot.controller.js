import { getMedicinesByDate, getAllMedicines } from '../services/medicine.service.js';
import axios from 'axios';

let warningCache = { date: '', warnings: [] };

export const getAIWarnings = async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  
  if (warningCache.date === date) {
    return res.json({ warnings: warningCache.warnings });
  }

  try {
    const todayMeds = await getMedicinesByDate(date);
    if (todayMeds.length === 0) {
      return res.json({ warnings: [] });
    }

    const history = await getAllMedicines();
    
    const missedStats = {};
    history.forEach(med => {
      const name = med.medicineName || med.name;
      const start = new Date(med.date);
      const end = new Date(med.endDate || med.date);
      let totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (totalDays < 1) totalDays = 1;
      
      const taken = med.takenDates ? med.takenDates.length : 0;
      const missed = Math.max(0, totalDays - taken);
      
      missedStats[name] = (missedStats[name] || 0) + missed;
    });

    const promptText = `
You are an AIoT health predictive engine.
Today's Medicines: ${JSON.stringify(todayMeds.map(m => ({ id: m.id, name: m.medicineName||m.name, time: m.time })))}
User's Missed History: ${JSON.stringify(missedStats)}

Task: Identify if the user needs an "early warning reminder" (e.g., 30 minutes before) for any of today's medicines based on their history of missing it often (>0 times).
Return ONLY a valid JSON array of warning objects. No extra text.
Format: [{"id": "medicine_id_here", "warnMinutesBefore": 30, "reason": "You often miss this dose. Get it ready early!"}]
`;

    let warnings = [];
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2',
        prompt: promptText,
        stream: false,
        format: 'json'
      }, { timeout: 15000 });

      warnings = JSON.parse(response.data.response);
      if (!Array.isArray(warnings)) warnings = [];
    } catch (aiError) {
      console.warn("AI generation failed or timed out. Falling back to rule-based.");
      warnings = todayMeds.map(m => {
        const name = m.medicineName || m.name;
        const missedCount = missedStats[name] || 0;
        if (missedCount > 0) {
          return { id: m.id, warnMinutesBefore: 30, reason: `Smart Alert: You've missed ${name} previously. Prepare it now so you don't forget!` };
        }
        return null;
      }).filter(Boolean);
    }

    warningCache = { date, warnings };
    res.json({ warnings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
