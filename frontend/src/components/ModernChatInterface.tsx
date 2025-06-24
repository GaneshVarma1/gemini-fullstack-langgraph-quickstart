import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileUploadDialog } from './FileUploadDialog';
import { ThemeToggle } from './ThemeToggle';
import { 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  Copy, 
  Zap,
  Clock,
  Target,
  Sparkles,
  FileText
} from 'lucide-react';

import type { Message as LangGraphMessage } from "@langchain/langgraph-sdk";

interface Message {
  id?: string;
  type: 'human' | 'ai';
  content: string;
  timestamp?: Date;
  files?: Array<{
    name: string;
    type: string;
    size: number;
  }>;
}

interface ProcessedEvent {
  title: string;
  data: string;
}

interface ModernChatInterfaceProps {
  messages: LangGraphMessage[];
  isLoading: boolean;
  onSubmit: (message: string, effort: string, model: string, files?: FileList) => void;
  onCancel: () => void;
  processedEvents: ProcessedEvent[];
}

export function ModernChatInterface({
  messages,
  isLoading,
  onSubmit,
  onCancel,
  processedEvents
}: ModernChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [effort, setEffort] = useState('medium');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages, processedEvents]);

  useEffect(() => {
    setIsTyping(isLoading);
  }, [isLoading]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    onSubmit(inputValue, effort, model, uploadedFiles || undefined);
    setInputValue('');
    setUploadedFiles(null);
    inputRef.current?.focus();
  }, [inputValue, effort, model, uploadedFiles, isLoading, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'low': return <Clock className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'high': return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-700/50 bg-neutral-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">AI Research Assistant</h1>
            <p className="text-sm text-neutral-400">Enhanced with document analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-400 border-green-500/30">
            {isLoading ? 'Processing...' : 'Ready'}
          </Badge>
          <ThemeToggle />
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20 inline-block mb-4">
                <Bot className="w-12 h-12 text-blue-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-neutral-400">Upload documents or ask me anything to begin your research.</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.type === 'human' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 h-fit">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <Card className={`max-w-2xl ${
                message.type === 'human' 
                  ? 'bg-blue-600/20 border-blue-500/30' 
                  : 'bg-neutral-800/50 border-neutral-700/50'
              }`}>
                <CardContent className="p-4">
                  {message.files && message.files.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {message.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-700/50">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-neutral-300">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(file.size / 1024).toFixed(1)}KB
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-700/50">
                    <span className="text-xs text-neutral-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="h-7 w-7 p-0 hover:bg-neutral-700/50"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      {copiedMessageId === message.id && (
                        <span className="text-xs text-green-400">Copied!</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {message.type === 'human' && (
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 h-fit">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Processing Events */}
          {processedEvents.length > 0 && isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 h-fit">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <Card className="bg-neutral-800/50 border-neutral-700/50 max-w-2xl">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {processedEvents.map((event, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-blue-400 font-medium">{event.title}</span>
                        <span className="text-neutral-400">- {event.data}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && processedEvents.length === 0 && (
            <div className="flex gap-4 justify-start">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 h-fit">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <Card className="bg-neutral-800/50 border-neutral-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-neutral-400 text-sm">Thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-neutral-700/50 bg-neutral-800/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          {/* Settings Bar */}
          <div className="flex items-center gap-4 mb-3">
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="w-40 bg-neutral-700/50 border-neutral-600">
                <div className="flex items-center gap-2">
                  {getEffortIcon(effort)}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Quick
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Balanced
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Deep Dive
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-48 bg-neutral-700/50 border-neutral-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
              </SelectContent>
            </Select>

            {uploadedFiles && (
              <Badge className={`${getEffortColor(effort)} flex items-center gap-1`}>
                <FileText className="w-3 h-3" />
                {uploadedFiles.length} file(s)
              </Badge>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything or upload documents to analyze..."
                className="min-h-[50px] max-h-32 resize-none bg-neutral-700/50 border-neutral-600 text-white placeholder-neutral-400 pr-12"
                disabled={isLoading}
              />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFileDialog(true)}
                className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-neutral-600/50"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="w-5 h-5" />
              </Button>
              
              {isLoading && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="text-red-400 border-red-500/30 hover:bg-red-500/20"
                >
                  Stop
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* File Upload Dialog */}
      <FileUploadDialog
        isOpen={showFileDialog}
        onClose={() => setShowFileDialog(false)}
        onFileUpload={(files) => {
          const dt = new DataTransfer();
          files.forEach(file => dt.items.add(file));
          setUploadedFiles(dt.files);
        }}
      />
    </div>
  );
} 