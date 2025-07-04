'use client';

import { useState, useEffect } from 'react';
import { ChatSession } from '@/types';
import { getChatSessions, deleteChatSession, clearAllSessions } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, FileText, Clock, Menu, X, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHistoryProps {
  currentSessionId?: string;
  onNewChat: () => void;
  onSelectChat: (sessionId: string) => void;
}

export default function ChatHistory({ 
  currentSessionId, 
  onNewChat, 
  onSelectChat 
}: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const loadSessions = () => {
      const savedSessions = getChatSessions();
      setSessions(savedSessions.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    };

    loadSessions();
    
    const handleStorageChange = () => loadSessions();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChatSession(sessionId);
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all conversations? This action cannot be undone.')) {
      clearAllSessions();
      setSessions([]);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  return (
    <div className={cn(
      'border-r-2 border-border bg-background flex flex-col sidebar-container',
      isMinimized ? 'sidebar-minimized' : 'sidebar-expanded'
    )}>
      {isMinimized ? (
        /* Minimized state - only expand button */
        <div className="p-1.5 sm:p-2 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpand}
            className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl menu-button flex items-center justify-center p-0"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-foreground" />
          </Button>
        </div>
      ) : (
        /* Expanded state - full sidebar */
        <>
          <div className={cn(
            'p-1.5 sm:p-2 lg:p-3 xl:p-4 flex items-center justify-between sidebar-content min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem]',
            isMinimized ? 'sidebar-content-minimized' : 'sidebar-content-expanded'
          )}>
            <Button 
              onClick={onNewChat} 
              className="flex-1 justify-start gap-1.5 sm:gap-2 lg:gap-3 h-8 sm:h-9 lg:h-10 xl:h-12 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white bg-gradient-to-r from-[#945069] to-[#86C866] hover:from-[#945069]/90 hover:to-[#86C866]/90 text-xs sm:text-sm lg:text-base min-w-0"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <span className="hidden xs:inline sm:hidden lg:inline truncate">New Conversation</span>
              <span className="xs:hidden sm:inline lg:hidden truncate">New Chat</span>
              <span className="sm:hidden truncate">New</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimize}
              className="ml-1 sm:ml-2 h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 rounded-lg sm:rounded-xl minimize-button flex-shrink-0"
            >
              <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
            </Button>
          </div>
          
          <ScrollArea className={cn(
            'flex-1 p-1.5 sm:p-2 lg:p-3 custom-scrollbar sidebar-content',
            isMinimized ? 'sidebar-content-minimized' : 'sidebar-content-expanded'
          )}>
            <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
              {sessions.map((session, index) => (
                <Card
                  key={session.id}
                  className={cn(
                    'p-2 sm:p-3 lg:p-4 cursor-pointer group transition-all duration-200 border-2 hover:shadow-lg sidebar-item smooth-transition',
                    currentSessionId === session.id 
                      ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary shadow-lg shadow-primary/10' 
                      : 'hover:bg-accent/50 border-border hover:border-primary/50'
                  )}
                  onClick={() => onSelectChat(session.id)}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2 lg:space-y-3">
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <div className={cn(
                          'p-1 sm:p-1.5 rounded-lg transition-all duration-200 flex-shrink-0',
                          currentSessionId === session.id 
                            ? 'bg-primary/20' 
                            : 'bg-muted/50 group-hover:bg-primary/10'
                        )}>
                          <MessageSquare className={cn(
                            'h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 transition-colors duration-200',
                            currentSessionId === session.id 
                              ? 'text-primary' 
                              : 'text-muted-foreground group-hover:text-primary'
                          )} />
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold truncate text-foreground min-w-0">
                          {session.title}
                        </h4>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {session.messages[0]?.content || 'No messages yet'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 text-xs text-muted-foreground">
                          <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                          <span>{session.messages.length}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                          <span className="hidden sm:inline">{new Date(session.updatedAt).toLocaleDateString()}</span>
                          <span className="sm:hidden">{new Date(session.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      {session.pdfFilename && (
                        <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 sm:px-2 py-1 rounded-lg w-fit transition-all duration-200 border border-primary/20">
                          <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                          <span className="truncate max-w-[60px] sm:max-w-[80px] lg:max-w-[120px]">{session.pdfFilename}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 p-0 hover:bg-destructive/10 hover:text-destructive no-rotate-hover flex-shrink-0 ml-1"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                    >
                      <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
              
              {sessions.length === 0 && (
                <div className="text-center py-6 sm:py-8 lg:py-12 space-y-2 sm:space-y-3 lg:space-y-4">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-muted/50 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-border">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-muted-foreground/50" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">No conversations yet</p>
                    <p className="text-xs text-muted-foreground/70">Start your first chat to see it here</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Clear All Button */}
          {sessions.length > 0 && (
            <div className={cn(
              'p-1.5 sm:p-2 lg:p-3 sidebar-content border-t border-border/50',
              isMinimized ? 'sidebar-content-minimized' : 'sidebar-content-expanded'
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="w-full justify-start gap-1.5 sm:gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg sm:rounded-xl transition-all duration-200 no-rotate-hover border border-destructive/20 hover:border-destructive/40 text-xs sm:text-sm h-7 sm:h-8 lg:h-9 xl:h-10"
              >
                <Trash className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:hidden lg:inline truncate">Clear All Conversations</span>
                <span className="xs:hidden sm:inline lg:hidden truncate">Clear All Chats</span>
                <span className="sm:hidden truncate">Clear All</span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}