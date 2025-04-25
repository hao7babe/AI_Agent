import React, { useState } from 'react';
import { generateContent } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateContent(input.trim());
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <section className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <article className="space-y-4 mb-4 h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <section
              key={index}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-auto'
                  : 'bg-gray-100'
              } max-w-[80%] ${
                message.role === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {message.content}
            </section>
          ))}
          {isLoading && (
            <section className="bg-gray-100 p-3 rounded-lg max-w-[80%] mr-auto">
              Thinking...
            </section>
          )}
          {error && (
            <aside className="bg-red-100 p-3 rounded-lg max-w-[80%] mr-auto text-red-700">
              {error}
            </aside>
          )}
        </article>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </section>
    </main>
  );
}; 