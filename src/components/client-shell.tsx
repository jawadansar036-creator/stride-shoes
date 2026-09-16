'use client';

import React, { useState } from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { CartDrawer } from './cart-drawer';
import { ChatWidget } from './ai-chat/chat-widget';
import { Sparkles } from 'lucide-react';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <Navbar onOpenChat={() => setChatOpen(true)} />
      
      <main className="flex-1">{children}</main>

      <Footer onOpenChat={() => setChatOpen(true)} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* RAG AI Chat Widget */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Floating AI Assistant Trigger Button (Bottom-Right) */}
      {!chatOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <button
            onClick={() => setChatOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-neutral-900 hover:bg-black text-white rounded-full shadow-2xl hover:shadow-black/30 hover:scale-105 transition-all duration-200 border border-neutral-700/60"
            aria-label="Open AI shopping assistant"
          >
            {/* Pulsing glow ring */}
            <span className="absolute -inset-1 rounded-full bg-accent/30 opacity-70 animate-pulse-slow blur-sm group-hover:opacity-100" />

            <div className="relative flex items-center justify-center w-7 h-7 bg-accent text-white rounded-full shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="relative text-left hidden sm:block pr-1">
              <span className="block text-xs font-black tracking-tight leading-none">Ask Stride AI</span>
              <span className="block text-[10px] text-neutral-400 font-medium mt-0.5 leading-none">
                Sizing & Recommendations
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
