import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello, Minister. I am FiscusAI. How can I assist you with revenue analysis, forecasting, or tax policy inquiries today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for Gemini API
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await geminiService.sendMessage(history, input);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I apologize, but I'm currently unable to process that request due to a connection issue.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Fiscal Assistant</h3>
            <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          Active
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              } ${msg.isError ? 'border-red-300 bg-red-50 text-red-800' : ''}`}
            >
              {msg.isError && <AlertTriangle size={16} className="mb-2 text-red-500" />}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-2">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              <span className="text-sm text-slate-500">Processing fiscal data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-end space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about tax revenue, forecast trends, or simulate policy changes..."
            className="flex-1 max-h-32 min-h-[44px] w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 resize-none"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
