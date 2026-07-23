import { getAllMedicines } from './medicine.service.js';

const getLocalDate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateInsights = async () => {
  const history = await getAllMedicines();
  
  if (!history || history.length === 0) {
    return {
      adherence: 0,
      missedCount: 0,
      nextMedicine: null,
      mostMissedTime: 'N/A',
      recommendation: 'No medicine history available yet.',
      summary: 'No data available',
      pattern: 'No patterns detected',
      riskLevel: 'Low',
      calendarData: []
    };
  }

  const todayStr = getLocalDate();
  
  // Calculate stats based on past and present days only
  let totalScheduled = 0;
  let totalTaken = 0;
  const missedTimesCounts = {};

  const calendarData = [];

  // Generate last 35 days
  for (let i = 34; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDate(d);
    
    // Find medicines scheduled for this date
    const scheduledMeds = history.filter(med => {
      const start = med.date;
      const end = med.endDate || med.date;
      return dateStr >= start && dateStr <= end;
    });

    if (scheduledMeds.length === 0) {
      calendarData.push({ day: d.getDate(), dateStr, status: 'empty' });
      continue;
    }

    let takenCount = 0;
    scheduledMeds.forEach(med => {
      totalScheduled++;
      const isTaken = med.takenDates && med.takenDates.includes(dateStr);
      if (isTaken) {
        takenCount++;
        totalTaken++;
      } else {
        missedTimesCounts[med.time] = (missedTimesCounts[med.time] || 0) + 1;
      }
    });

    let status = 'empty';
    if (takenCount === scheduledMeds.length) status = 'perfect';
    else if (takenCount > 0) status = 'partial';
    else status = 'missed';

    calendarData.push({ day: d.getDate(), dateStr, status });
  }

  const missedCount = totalScheduled - totalTaken;
  const adherence = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;

  let mostMissedTime = 'N/A';
  let maxMissed = 0;
  for (const [time, count] of Object.entries(missedTimesCounts)) {
    if (count > maxMissed) {
      maxMissed = count;
      mostMissedTime = time;
    }
  }

  // Determine rule-based fallback recommendation
  let ruleRecommendation = '';
  if (adherence < 70) {
    ruleRecommendation = "Your adherence is low. Try improving your reminder frequency or linking your medication to daily habits.";
  } else if (mostMissedTime !== 'N/A' && mostMissedTime.includes('PM')) {
    ruleRecommendation = "Try taking medicines immediately after dinner. Night time routines can help improve consistency.";
  } else if (adherence > 90) {
    ruleRecommendation = "Excellent consistency! Keep up the great work in managing your health.";
  } else {
    ruleRecommendation = "You're doing well. Keep tracking your medicines to maintain good health.";
  }

  return {
    adherence,
    missedCount,
    mostMissedTime,
    recommendation: ruleRecommendation,
    summary: `Patient adherence stands at ${adherence}%.`,
    pattern: mostMissedTime !== 'N/A' ? `Doses frequently missed around ${mostMissedTime}.` : 'No distinct missed pattern detected.',
    riskLevel: adherence < 70 ? 'High' : adherence < 85 ? 'Moderate' : 'Low',
    calendarData
  };
};

