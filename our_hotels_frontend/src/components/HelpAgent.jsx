import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Loader, RefreshCw } from 'lucide-react';

function HelpAgent({ onClose }) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample AI responses for demonstration
  const aiResponses = [
    "I understand your concern. Let me help you with that.",
    "Thank you for your question! Here's what I can tell you...",
    "That's a great question! Based on my knowledge, I would suggest...",
    "I'm here to assist you. Could you provide more details about your issue?",
    "I've processed your query. Here's the information you requested..."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSend = async () => {
    if (message.trim() === '') return;
    
    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user'
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setIsTyping(true);
      
      // Simulate AI response with typing effect
      const responseText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      let displayText = '';
      const typingInterval = setInterval(() => {
        if (displayText.length < responseText.length) {
          displayText += responseText[displayText.length];
          
          // Update the conversation with the partial response
          setConversation(prev => {
            const newConv = [...prev];
            if (newConv[newConv.length - 1]?.sender === 'agent') {
              newConv[newConv.length - 1].text = displayText;
            } else {
              newConv.push({
                id: Date.now() + 1,
                text: displayText,
                sender: 'agent'
              });
            }
            return newConv;
          });
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 20);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setConversation([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 flex flex-col"
        style={{ height: '85vh', maxHeight: '700px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">YoYo Help Agent</h2>
              <p className="text-blue-100 text-sm">AI Assistant</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {conversation.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center p-4"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Bot size={40} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I help you today?</h3>
              <p className="text-gray-600 max-w-xs">Ask me anything and I'll do my best to assist you.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {conversation.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-xs ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 ${msg.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-blue-500' : 'bg-indigo-500'}`}>
                          {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                        </div>
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'}`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start max-w-xs">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500">
                        <Bot size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
                      <Loader size={16} className="animate-spin text-indigo-500" />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end">
            <textarea
              className="flex-1 border border-gray-300 rounded-l-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your question here..."
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isTyping}
            />
            <button
              className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSend}
              disabled={isLoading || isTyping || message.trim() === ''}
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="flex justify-between mt-2">
            <button
              onClick={clearConversation}
              className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
            >
              <RefreshCw size={14} className="mr-1" />
              Clear Chat
            </button>
            <span className="text-xs text-gray-500">Press Enter to send</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HelpAgent;