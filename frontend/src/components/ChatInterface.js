import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const messagesEndRef = useRef(null);

  // 从后端加载历史消息
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8000/chat/history');
        if (response.data && response.data.messages) {
          setMessages(response.data.messages.map(msg => ({
            type: msg.is_user ? 'user' : 'ai',
            content: msg.content,
            timestamp: msg.timestamp
          })));
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadHistory();
  }, []);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // 添加用户消息
    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 调用后端API
      const response = await axios.post('http://localhost:8000/chat/', {
        content: userMessage.content,
        timestamp: userMessage.timestamp
      });

      // 添加AI回复
      const aiMessage = {
        type: 'ai',
        content: response.data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // 添加错误消息
      const errorMessage = {
        type: 'ai',
        content: '抱歉，我遇到了一些问题，请稍后再试。',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      // 调用后端API清除历史记录
      await axios.delete('http://localhost:8000/chat/history');
      setMessages([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧AI女友照片区域 */}
      <div className="w-2/3 bg-white shadow-lg flex items-center justify-center">
        <img
          src="/test.gif"
          alt="AI女友照片"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 右侧聊天区域 */}
      <div className="w-1/3 flex flex-col relative">
        {/* 清除记忆按钮 */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          onMouseEnter={() => setShowClearButton(true)}
          onMouseLeave={() => setShowClearButton(false)}
        >
          <div className="w-4 h-4 bg-gray-300 rounded-r-lg"></div>
          {showClearButton && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            >
              <button
                onClick={handleClearHistory}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors shadow-md"
              >
                清除记忆
              </button>
            </motion.div>
          )}
        </div>

        {/* 聊天历史记录 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-lg p-3 bg-white text-gray-800 shadow-md">
                正在思考...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框区域 */}
        <div className="p-4 bg-white shadow-lg">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="输入消息..."
              className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors shadow-md ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={isLoading}
            >
              发送
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 