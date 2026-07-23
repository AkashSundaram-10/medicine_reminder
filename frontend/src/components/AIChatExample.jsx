import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, Bot, User } from 'lucide-react';

export default function AIChatExample() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      // Connects to our new Node.js backend route
      const res = await axios.post('http://localhost:5000/api/ai/chat', {
        prompt: prompt
      });

      if (res.data.success) {
        setResponse(res.data.response);
      } else {
        setError('AI request failed: ' + res.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl mt-10 border border-slate-100">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Health AI Assistant</h2>
          <p className="text-slate-500 text-sm">Powered by local Llama 3.2</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Chat History Display */}
        {response && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div className="bg-slate-100 text-slate-800 px-5 py-3 rounded-2xl rounded-tl-sm text-sm font-medium">
                {prompt}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="bg-indigo-50 text-indigo-900 border border-indigo-100 px-5 py-4 rounded-2xl rounded-tl-sm text-sm font-medium whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium border border-rose-200">
            {error}
          </div>
        )}

        {/* Chat Input */}
        <form onSubmit={handleAskAI} className="relative mt-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Give health advice for missing medicine for 3 days..."
            className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 px-5 py-4 pr-16 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
