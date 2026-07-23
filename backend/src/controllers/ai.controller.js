import { generateAIResponse } from '../services/ai.service.js';

export const handleAIChat = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const aiResponse = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
