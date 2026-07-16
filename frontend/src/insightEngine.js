/**
 * AI Insight Engine
 * Calculates adherence and provides smart recommendations based on medicine history.
 */

export const calculateInsights = (history) => {
  if (!history || history.length === 0) {
    return {
      adherence: 0,
      missedCount: 0,
      mostMissedTime: 'N/A',
      recommendation: 'No medicine history available yet.',
    };
  }

  const total = history.length;
  const taken = history.filter(item => item.status === 'Taken').length;
  const missed = total - taken;
  
  const adherence = Math.round((taken / total) * 100);

  // Find most missed time
  const missedItems = history.filter(item => item.status === 'Missed');
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
    missedCount: missed,
    mostMissedTime,
    recommendation
  };
};
