'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Layout from '@/components/Layout';
import ChatHistory from '@/components/ChatHistory';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Message, ChatSession } from '@/types';
import { saveChatSession, getChatSession } from '@/lib/storage';
import { askQuestion } from '@/lib/api';
import { FileText, AlertCircle, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function ChatPage() {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string | null>(null);
  // Remove async polling state
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const uploadedPDF = sessionStorage.getItem('uploadedPDF');
    if (uploadedPDF) {
      setPdfFilename(uploadedPDF);
      sessionStorage.removeItem('uploadedPDF');
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentSession?.messages]);

  const createNewSession = (): ChatSession => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      pdfFilename: pdfFilename || undefined,
    };
    return newSession;
  };

  const handleNewChat = () => {
    const newSession = createNewSession();
    setCurrentSession(newSession);
    setError(null);
  };

  const handleSelectChat = (sessionId: string) => {
    const session = getChatSession(sessionId);
    if (session) {
      setCurrentSession(session);
      setError(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSession) {
      const newSession = createNewSession();
      setCurrentSession(newSession);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedSession = currentSession || createNewSession();
    const sessionWithUserMessage = {
      ...updatedSession,
      messages: [...updatedSession.messages, userMessage],
      updatedAt: new Date(),
      title: updatedSession.messages.length === 0 ? content.slice(0, 50) + '...' : updatedSession.title,
    };

    setCurrentSession(sessionWithUserMessage);
    setIsLoading(true);
    setError(null);

    try {
      const response = await askQuestion(content);
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };

      const finalSession = {
        ...sessionWithUserMessage,
        messages: [...sessionWithUserMessage.messages, assistantMessage],
        updatedAt: new Date(),
      };

      setCurrentSession(finalSession);
      saveChatSession(finalSession);
      toast.success('Response received');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopGeneration = () => {
    setIsLoading(false);
    toast.info('Stop is not supported in this mode.');
  };

  if (!currentSession) {
    return (
      <Layout>
        <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
          <ChatHistory 
            onNewChat={handleNewChat} 
            onSelectChat={handleSelectChat}
          />
          
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card className="max-w-2xl mx-auto relative overflow-hidden border-2 shadow-xl sm:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
              <CardHeader className="text-center pb-4 sm:pb-6 relative p-4 sm:p-6">
                <div className="mx-auto mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl animate-pulse"></div>
                  <div className="relative bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl float border-2 border-gray-200">
                    <svg 
                      className="h-8 w-8 sm:h-10 lg:h-12 sm:w-10 lg:w-12 mx-auto" 
                      viewBox="0 0 32 32" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient gradientTransform="rotate(25)" id="welcome-brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#945069" stopOpacity="1"></stop>
                          <stop offset="100%" stopColor="#86C866" stopOpacity="1"></stop>
                        </linearGradient>
                      </defs>
                      <g fill="url(#welcome-brand-gradient)">
                        <path d="M15.965 16.258l.707-.707 10.39 10.39-.707.707z"></path>
                        <path d="M4.935 26.357L26.018 5.274l.707.707L5.642 27.065z"></path>
                        <path d="M31 1v4.194h-4.194V1H31m1-1h-6.194v6.194H32V0zM31 26.806V31h-4.194v-4.194H31m1-1h-6.194V32H32v-6.194zM5.194 26.806V31H1v-4.194h4.194m1-1H0V32h6.194v-6.194z"></path>
                      </g>
                    </svg>
                    <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-6 sm:w-6 text-yellow-400 animate-bounce" />
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-foreground leading-tight">
                  Welcome to Inferra Assistant
                </CardTitle>
                <CardDescription className="text-base sm:text-lg leading-relaxed text-muted-foreground px-2">
                  Start a new conversation to unlock the power of AI-driven document analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center relative space-y-4 sm:space-y-6 p-4 sm:p-6">
                <Button 
                  onClick={handleNewChat} 
                  size="lg" 
                  className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#945069] to-[#86C866] hover:from-[#945069]/90 hover:to-[#86C866]/90 text-white w-full sm:w-auto"
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  <span>Start New Conversation</span>
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3" />
                </Button>
                
                {pdfFilename && (
                  <div className="mt-4 sm:mt-6">
                    <Badge variant="secondary" className="gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-primary/10 text-primary border-2 border-primary/20 break-all sm:break-normal">
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-none">{pdfFilename}</span>
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
        <ChatHistory 
          currentSessionId={currentSession.id}
          onNewChat={handleNewChat} 
          onSelectChat={handleSelectChat}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-background p-3 sm:p-4 lg:p-6 border-b border-border">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="space-y-1 min-w-0 flex-1 mr-4">
                <h2 className="text-lg sm:text-xl font-bold truncate text-foreground">{currentSession.title}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 flex-shrink-0" />
                  <span>{currentSession.messages.length} messages</span>
                </p>
              </div>
              
              {currentSession.pdfFilename && (
                <Badge variant="secondary" className="gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-primary/10 text-primary border-2 border-primary/20 text-xs sm:text-sm flex-shrink-0">
                  <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">{currentSession.pdfFilename}</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 custom-scrollbar" ref={scrollAreaRef}>
            <div className="max-w-4xl mx-auto">
              {currentSession.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && <TypingIndicator />}
              
              {currentSession.messages.length === 0 && (
                <div className="flex items-center justify-center h-full p-6 sm:p-8 lg:p-12 text-center">
                  <div className="space-y-4 sm:space-y-6 max-w-md">
                    <div className="mx-auto relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl sm:rounded-3xl blur-md sm:blur-lg"></div>
                      <div className="relative bg-background p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-border">
                        <MessageSquare className="h-8 w-8 sm:h-10 lg:h-12 sm:w-10 lg:w-12 text-primary mx-auto" />
                      </div>
                    </div>
                    <div className="px-4">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">Ask your first question</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        Start by asking a question about your PDF document. I'm here to help you understand and analyze its content.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Error Alert */}
          {error && (
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="max-w-4xl mx-auto">
                <Alert variant="destructive" className="border-2">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <AlertDescription className="text-sm sm:text-base font-medium">{error}</AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {/* Input */}
          <ChatInput 
            onSendMessageAction={handleSendMessage}
            isLoading={isLoading}
            onStopAction={handleStopGeneration}
            onUploadPDFAction={(filename) => {
              setPdfFilename(filename);
              if (currentSession) {
                setCurrentSession({ ...currentSession, pdfFilename: filename });
              }
              toast.success('PDF attached to chat!');
            }}
          />
        </div>
      </div>
    </Layout>
  );
}