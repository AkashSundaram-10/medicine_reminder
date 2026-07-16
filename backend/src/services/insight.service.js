import { getAllMedicines } from './medicine.service.js';

export const calculateInsights = async () => {
  const history = await getAllMedicines();
  
  if (!history || history.length === 0) {
    return {
      adherence: 0,
      missedCount: 0,
      nextMedicine: null,
      mostMissedTime: 'N/A',
      recommendation: 'No medicine history available yet.',
    };
  }

  const total = history.length;
  const taken = history.filter(item => item.taken === true).length;
  const missedCount = total - taken;
  
  const adherence = Math.round((taken / total) * 100);

  // Find most missed time
  const missedItems = history.filter(item => item.taken === false);
  const missedTimes = missedItems.map(item => item.time);
  
  let mostMissedTime = 'N/A';
  if (missedTimes.length > 0) {
    const counts = {};
    let maxCount = 0;
    
    missedTimes.forEach(time => {
      counts[time] = (counts[time] || 0) + 1;
      if (counts[time] > maxCount) {
        maxCount = counts[time];
        mostMissedTime = time;
      }
    });
  }

  // Find next medicine (simplistic approach based on current time)
  // Real implementation would parse Date objects
  const nextMedicine = history.find(m => !m.taken) || null;

  // Generate Recommendation
  let recommendation = '';
  if (adherence < 70) {
    recommendation = "Your adherence is low. Try improving your reminder frequency or linking your medication to daily habits.";
  } else if (mostMissedTime !== 'N/A' && mostMissedTime.includes('PM')) {
    recommendation = "Try taking medicines immediately after dinner. Night time routines can help improve consistency.";
  } else if (adherence > 90) {
    recommendation = "Excellent consistency! Keep up the great work in managing your health.";
  } else {
    recommendation = "You're doing well. Keep tracking your medicines to maintain good health.";
  }

  return {
    adherence,
    missedCount,
    nextMedicine,
    mostMissedTime,
    recommendation
  };
};
