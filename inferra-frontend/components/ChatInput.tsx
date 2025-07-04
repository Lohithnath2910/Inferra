'use client';

import { useState, useRef } from 'react';
import { Send, Square, Sparkles, PlaneTakeoff, Paperclip } from 'lucide-react';
import { uploadPDF } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessageAction: (message: string) => void;
  isLoading: boolean;
  onStopAction?: () => void;
  onUploadPDFAction?: (filename: string) => void;
}

export default function ChatInput({ onSendMessageAction, isLoading, onStopAction, onUploadPDFAction }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showFileDialog, setShowFileDialog] = useState(false);
  // Ref to hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadPDFAction) {
      try {
        const response = await uploadPDF(file);
        if (response && response.filename) {
          onUploadPDFAction(response.filename);
        } else {
          alert(response.message || 'Upload failed');
        }
      } catch (err: any) {
        alert(err?.message || 'Upload failed');
      }
    }
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessageAction(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-background p-3 sm:p-4 lg:p-6">
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4 max-w-4xl mx-auto items-end">
        {/* Attach PDF Button (file picker only) */}
        <div className="flex flex-col justify-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Button
            type="button"
            size="lg"
            className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-primary to-primary/80 text-white border-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1 mr-1"
            disabled={isLoading}
            onClick={handleAttachClick}
          >
            <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs font-medium">Attach</span>
          </Button>
        </div>
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your PDF document..."
            className="min-h-[50px] sm:min-h-[60px] max-h-32 resize-none rounded-xl sm:rounded-2xl border-2 border-border focus:border-primary/50 bg-background px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base leading-relaxed transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
            disabled={isLoading}
          />
          {message.trim() && (
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-lg border border-border hidden sm:block">
              Press Enter to send
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-end">
          {isLoading ? (
            <Button
              type="button"
              size="lg"
              onClick={onStopAction}
              className="h-[50px] w-[60px] sm:h-[60px] sm:w-[80px] rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1"
            >
              <Square className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs font-medium">Stop</span>
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              disabled={!message.trim()}
              className="h-[50px] w-[60px] sm:h-[60px] sm:w-[80px] rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group bg-gradient-to-br from-[#945069] to-[#86C866] hover:from-[#945069]/90 hover:to-[#86C866]/90 text-white border-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1 disabled:bg-gradient-to-br disabled:from-gray-400 disabled:to-gray-500"
            >
              {message.trim() ? (
                <>
                  <PlaneTakeoff className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-xs font-medium">Send</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                  <span className="text-xs font-medium opacity-50">Send</span>
                </>
              )}
            </Button>
          )}
        </div>
      </form>
      
      <div className="text-center mt-3 sm:mt-4">
        <p className="text-xs text-muted-foreground">
          AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}