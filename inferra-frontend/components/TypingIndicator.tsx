'use client';

import { Bot, Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-4 p-6 message-enter">
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-sm animate-pulse"></div>
          <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-card to-card/80 rounded-2xl p-5 shadow-lg border-2 border-border/50">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}