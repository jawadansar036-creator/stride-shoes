'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Bot, 
  User, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { ProductItem } from '@/lib/products-data';
import { ChatProductCard } from './chat-product-card';

interface ChatMessageUI {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedProducts?: ProductItem[];
  citations?: string[];
  suggestedQuestions?: string[];
  provider?: string;
  timestamp: string;
}

const INITIAL_PROMPTS = [
  'Best running shoes for marathons?',
  'Do you have shoes under $150?',
  'What is your return policy?',
  'Which shoes are best for wide feet?',
  'How do I wash my running shoes?'
];

export function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessageUI[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `👋 Hello! I am the **Stride AI Footwear Specialist**.\n\nI can help you:\n- Find the right pair based on your sport, budget, or foot shape\n- Advise on sizing & wide-foot fits\n- Explain our **30-day wear trial** & **free shipping over $75**\n- Compare midsole foams and carbon propulsion plates\n\nHow can I help you take your next step today?`,
      timestamp: 'Just now',
      suggestedQuestions: [
        'Show me running shoes with carbon plates',
        'What shoes do you recommend for wide feet?',
        'Tell me about your 30-day trial'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 150);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessageUI = {
      id: userMsgId,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history for RAG endpoint
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessageUI = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.message || 'I have analyzed your request based on our catalog and store policies.',
        recommendedProducts: data.recommendedProducts || [],
        citations: data.citations || [],
        suggestedQuestions: data.suggestedQuestions || [],
        provider: data.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `I experienced a slight delay retrieving that information. In the meantime, remember we offer **free standard shipping over $75** and a **30-day "Run In Them" guarantee** on all footwear! Feel free to try asking again.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end sm:p-6 pointer-events-none">
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto sm:hidden animate-fade-in"
        onClick={onClose}
      />

      {/* Chat Container */}
      <div className="pointer-events-auto relative w-full sm:w-[440px] h-[90vh] sm:h-[620px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col border border-neutral-200 overflow-hidden animate-slide-up z-10">
        {/* Header */}
        <div className="bg-neutral-950 text-white p-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-amber-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-neutral-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-900" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm tracking-tight text-white">STRIDE AI Concierge</h3>
                <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-medium">
                  RAG
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Knowledge-grounded footwear assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages((prev) => [prev[0]]);
              }}
              title="Reset conversation"
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
              aria-label="Close AI chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-neutral-900 text-white rounded-tr-none'
                      : 'bg-white text-neutral-800 border border-neutral-200 shadow-sm rounded-tl-none space-y-3'
                  }`}
                >
                  {/* Message Content (Formatted Markdown) */}
                  <div className="whitespace-pre-line prose-xs">
                    {msg.content}
                  </div>

                  {/* Recommended Products Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="pt-2 border-t border-neutral-100 space-y-2">
                      <p className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                        👟 Recommended Pairs
                      </p>
                      <div className="space-y-2">
                        {msg.recommendedProducts.map((p) => (
                          <ChatProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grounding Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-1 items-center">
                      <span className="text-[10px] text-neutral-400 font-medium">Verified from:</span>
                      {msg.citations.map((cite, i) => (
                        <span
                          key={i}
                          className="text-[9px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium"
                        >
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dynamic Suggested Follow-ups */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sq)}
                          className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg transition-colors font-medium text-left flex items-center gap-1"
                        >
                          <span>{sq}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 ${
                      isUser ? 'text-neutral-400 text-right' : 'text-neutral-400'
                    }`}
                  >
                    {msg.timestamp}
                    {msg.provider && ` · ${msg.provider}`}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-2.5 justify-start animate-fade-in">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-neutral-400 ml-1 font-medium">Retrieving knowledge & catalog...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starters Carousel (when only 1 or 2 messages) */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-white border-t border-neutral-100 overflow-x-auto scrollbar-none flex gap-1.5">
            {INITIAL_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs rounded-full font-medium transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about shoes, sizes, shipping, or returns..."
              disabled={loading}
              className="flex-1 bg-neutral-100 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black border-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 text-white disabled:text-neutral-400 rounded-xl transition-all shadow-sm shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 px-1">
            <span>Powered by RAG Retrieval & Vector Embeddings</span>
            <span>Free exchanges on all orders</span>
          </div>
        </div>
      </div>
    </div>
  );
}
