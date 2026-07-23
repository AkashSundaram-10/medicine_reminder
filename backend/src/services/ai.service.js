import axios from 'axios';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export const generateAIResponse = async (prompt) => {
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: 'llama3.2',
      prompt: prompt,
      stream: false,
    });
    return response.data.response;
  } catch (error) {
    console.error('Error communicating with Ollama:', error.message);
    throw new Error('Failed to generate AI response. Please ensure Ollama is running locally.');
  }
};
