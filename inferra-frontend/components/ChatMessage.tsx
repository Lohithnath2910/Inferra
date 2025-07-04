'use client';

import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  // Streaming effect for assistant messages
  const [displayed, setDisplayed] = useState(isUser ? message.content : '');
  useEffect(() => {
    if (isUser) {
      setDisplayed(message.content);
      return;
    }
    setDisplayed('');
    let i = 0;
    let lines = message.content.split('\n');
    let current = '';
    let lineIdx = 0;
    let charIdx = 0;
    let timeout: NodeJS.Timeout;
    function stream() {
      if (lineIdx >= lines.length) return;
      if (charIdx < lines[lineIdx].length) {
        current += lines[lineIdx][charIdx];
        setDisplayed(current);
        charIdx++;
        timeout = setTimeout(stream, 8); // fast per character
      } else {
        current += '\n';
        setDisplayed(current);
        lineIdx++;
        charIdx = 0;
        timeout = setTimeout(stream, 30); // slightly longer per line
      }
    }
    stream();
    return () => clearTimeout(timeout);
  }, [message.content, isUser]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } 

  return (
    <div className={cn(
      'flex gap-2 sm:gap-4 p-3 sm:p-4 lg:p-6 message-enter',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl sm:rounded-2xl blur-sm"></div>
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      )}
      
      <div className={cn(
        'flex flex-col gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] lg:max-w-[75%]',
        isUser ? 'items-end' : 'items-start'
      )}>
        <Card className={cn(
          'relative group shadow-lg border-2 transition-all duration-200',
          isUser 
            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/20 hover:shadow-primary/20' 
            : 'bg-gradient-to-br from-card to-card/80 border-border/50 hover:border-border hover:shadow-xl'
        )}>
          <div className="p-3 sm:p-4 lg:p-5">
            {/* Copy button for assistant messages */}
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-background/10"
              >
                {copied ? (
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                ) : (
                  <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                )}
              </Button>
            )}
            
            <div className="text-sm sm:text-base leading-relaxed">
              {isUser ? (
                <p className="font-medium">{message.content}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 sm:mb-3 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 sm:ml-5 mb-2 sm:mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 sm:ml-5 mb-2 sm:mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-background/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono border">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-background/20 p-2 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm overflow-x-auto border font-mono">
                        {children}
                      </pre>
                    ),
                    h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2">{children}</h3>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/30 pl-3 sm:pl-4 italic my-2 sm:my-3">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {displayed}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </Card>
        
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs text-muted-foreground font-medium">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {isUser && (
            <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-muted/50 rounded-xl sm:rounded-2xl blur-sm"></div>
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-muted to-muted/80 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border-2 border-border/50">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}