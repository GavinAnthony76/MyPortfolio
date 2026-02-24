import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Minimize2, X, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose?: () => void;
}

export default function AIAssistant({ onClose }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownGreeting, setHasShownGreeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-show greeting after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShownGreeting) {
        showGreeting();
        setHasShownGreeting(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasShownGreeting]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const showGreeting = async () => {
    try {
      const response = await fetch('/api/ai/greeting');
      if (response.ok) {
        const data = await response.json();
        setMessages([{
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }]);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Failed to load greeting:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          conversationHistory
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm having technical difficulties. Please contact support@gavineanthony.com for technical assistance.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      if (messages.length === 0 && !hasShownGreeting) {
        showGreeting();
        setHasShownGreeting(true);
      }
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    onClose?.();
  };

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content
      .split('\n\n')
      .map((paragraph, index) => (
        <p key={index} className="mb-2 last:mb-0">
          {paragraph.split('\n').map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ));
  };

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 w-[calc(100vw-16px)] sm:w-auto max-w-xs sm:max-w-sm" data-testid="ai-assistant-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-full shadow-2xl border-0 bg-white dark:bg-gray-900 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white rounded-t-lg relative overflow-hidden">
                {/* Background sparkle effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-800/20 animate-pulse"></div>
                <div className="flex items-center space-x-2 relative z-10">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">AI Assistant</span>
                    <div className="text-xs text-blue-100 opacity-90 hidden sm:block">Ask me anything</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 relative z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleChat}
                    className="text-white hover:bg-white/20 hover:backdrop-blur-sm transition-all duration-200 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full"
                    data-testid="button-minimize-chat"
                  >
                    <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeChat}
                    className="text-white hover:bg-white/20 hover:backdrop-blur-sm transition-all duration-200 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full"
                    data-testid="button-close-chat"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              {!isMinimized && (
                <CardContent className="p-0">
                  <div className="h-60 sm:h-80 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900" data-testid="chat-messages">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-2 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] sm:max-w-[75%] rounded-2xl p-2.5 sm:p-3 shadow-lg ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="text-xs sm:text-sm leading-relaxed">
                            {message.role === 'assistant' 
                              ? formatMessage(message.content)
                              : message.content
                            }
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2.5 sm:p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-3 sm:p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-900 rounded-b-lg">
                    <div className="flex items-center space-x-2">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask about services, tech stacks, or your project..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="flex-1 rounded-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-sm sm:text-base px-4 py-2"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-testid="input-chat-message"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!currentMessage.trim() || isLoading}
                        size="sm"
                        className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="button-send-message"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.5, duration: 0.3 }}
        >
          <Button
            onClick={toggleChat}
            size="lg"
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 shadow-xl hover:shadow-2xl text-white border-0 transition-all duration-300 transform hover:scale-110 relative overflow-hidden group"
            data-testid="button-open-chat"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}