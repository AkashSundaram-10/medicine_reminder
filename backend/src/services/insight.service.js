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

  let recommendation = ruleRecommendation;
  let aiSummary = null;
  let aiPattern = null;
  let aiRiskLevel = adherence < 70 ? 'High' : adherence < 85 ? 'Moderate' : 'Low';

  // Try calling local Ollama (Llama 3.2) AI engine
  try {
    const prompt = `You are a medical adherence assistant. Analyze this patient's medication data:
- Total Scheduled Doses: ${total}
- Taken Doses: ${taken}
- Missed Doses: ${missedCount}
- Adherence Rate: ${adherence}%
- Most Missed Time: ${mostMissedTime}

Generate a short JSON response with keys: "summary", "pattern", "recommendation", "riskLevel". Keep it concise and professional.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt,
        stream: false,
        format: 'json'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json();
      const parsed = JSON.parse(data.response);
      if (parsed.recommendation) recommendation = parsed.recommendation;
      if (parsed.summary) aiSummary = parsed.summary;
      if (parsed.pattern) aiPattern = parsed.pattern;
      if (parsed.riskLevel) aiRiskLevel = parsed.riskLevel;
    }
  } catch (err) {
    // Fallback to calculated rules if Ollama is offline or times out
  }

  return {
    adherence,
    missedCount,
    nextMedicine,
    mostMissedTime,
    recommendation,
    summary: aiSummary || `Patient adherence stands at ${adherence}%.`,
    pattern: aiPattern || (mostMissedTime !== 'N/A' ? `Doses frequently missed around ${mostMissedTime}.` : 'No distinct missed pattern detected.'),
    riskLevel: aiRiskLevel
  };
};

