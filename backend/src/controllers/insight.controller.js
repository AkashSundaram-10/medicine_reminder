import { calculateInsights } from '../services/insight.service.js';

export const getInsights = async (req, res) => {
  try {
    const insights = await calculateInsights();
    res.json(insights);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
