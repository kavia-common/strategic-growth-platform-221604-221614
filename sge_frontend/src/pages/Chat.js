import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Send, Plus, MessageSquare, Bot, User } from 'lucide-react';
import classNames from 'classnames';

// PUBLIC_INTERFACE
const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      // Mocking endpoint if not ready, but trying to hit actual backend
      // Adjust endpoint based on backend implementation
      const response = await api.get('/api/chat/conversations');
      setConversations(response.data);
      if (response.data.length > 0 && !activeConversationId) {
        setActiveConversationId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback mock data for UI testing if backend is down
      setConversations([
        { id: 1, title: 'Strategic Analysis Q1', created_at: new Date().toISOString() },
        { id: 2, title: 'Market Trends 2024', created_at: new Date().toISOString() }
      ]);
      if (!activeConversationId) setActiveConversationId(1);
    }
  };

  const fetchMessages = async (conversationId) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/chat/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback mock
      setMessages([
        { id: 1, role: 'user', content: 'What are the key trends for Q1?' },
        { id: 2, role: 'assistant', content: 'Key trends for Q1 include increased adoption of AI tools and shift towards sustainable supply chains.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: Date.now(),
      role: 'user',
      content: newMessage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setSending(true);

    try {
      // Adjust endpoint based on backend
      const response = await api.post('/api/chat/message', {
        conversation_id: activeConversationId,
        content: tempMessage.content
      });

      // Assuming backend returns the AI response or the updated list
      if (response.data && response.data.role === 'assistant') {
          setMessages(prev => [...prev, response.data]);
      } else {
          // If backend returns list or different structure, re-fetch
          fetchMessages(activeConversationId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Mock response for UI
      setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            role: 'assistant',
            content: "I'm having trouble connecting to the server, but I received: " + tempMessage.content
        }]);
      }, 1000);
    } finally {
      setSending(false);
    }
  };

  const createNewChat = async () => {
      // Logic to create new chat
      const newChat = { id: Date.now(), title: 'New Conversation', created_at: new Date().toISOString() };
      setConversations([newChat, ...conversations]);
      setActiveConversationId(newChat.id);
      setMessages([]);
  };

  return (
    <div className="chat-container">
      {/* Chat Sidebar */}
      <div className="chat-sidebar">
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={createNewChat}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveConversationId(chat.id)}
              className={classNames('p-3 rounded-lg mb-1 cursor-pointer flex items-center gap-3 hover:bg-gray-100 transition-colors', {
                'bg-blue-50 border-l-4 border-blue-500': activeConversationId === chat.id
              })}
            >
              <MessageSquare size={18} className={activeConversationId === chat.id ? 'text-blue-500' : 'text-gray-400'} />
              <div className="truncate text-sm font-medium text-gray-700">
                {chat.title || 'New Conversation'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
                <div className="spinner"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bot size={48} className="mb-4 text-blue-200" />
              <p>Start a new conversation with SGE AI</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={classNames('flex gap-4 max-w-3xl mx-auto', {
                  'flex-row-reverse': msg.role === 'user'
                })}
              >
                <div className={classNames('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', {
                    'bg-blue-600 text-white': msg.role === 'user',
                    'bg-amber-500 text-white': msg.role !== 'user'
                })}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={classNames('message-bubble', {
                  'message-user': msg.role === 'user',
                  'message-ai': msg.role !== 'user'
                })}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {sending && (
             <div className="flex gap-4 max-w-3xl mx-auto">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-white">
                    <Bot size={16} />
                </div>
                <div className="message-bubble message-ai flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="input pr-12 py-3 shadow-sm"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-400">AI can make mistakes. Verify important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
