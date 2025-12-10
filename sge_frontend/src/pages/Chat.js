import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { Send, Plus, MessageSquare, Bot, User, Mic } from 'lucide-react';
import classNames from 'classnames';

// PUBLIC_INTERFACE
/**
 * Chat component - AI-powered chat interface with conversation management
 * Provides a polished UI for interacting with the SGE AI assistant
 */
const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = useCallback(async () => {
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
  }, [activeConversationId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

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

  const fetchMessages = async (conversationId) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/chat/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback mock
      setMessages([
        { id: 1, role: 'user', content: 'What are the key trends for Q1?', created_at: new Date().toISOString() },
        { id: 2, role: 'assistant', content: 'Key trends for Q1 include increased adoption of AI tools and shift towards sustainable supply chains.', created_at: new Date().toISOString() }
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
            content: "I'm having trouble connecting to the server, but I received: " + tempMessage.content,
            created_at: new Date().toISOString()
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

  const handleMicClick = () => {
    // Placeholder for future voice recording functionality
    console.log('Microphone clicked - feature coming soon');
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      {/* Chat Sidebar */}
      <div className="chat-sidebar">
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={createNewChat}
            className="w-full btn btn-primary flex items-center justify-center gap-2 chat-new-btn"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveConversationId(chat.id)}
              className={classNames('chat-conversation-item', {
                'chat-conversation-active': activeConversationId === chat.id
              })}
            >
              <MessageSquare size={18} className={activeConversationId === chat.id ? 'text-blue-600' : 'text-gray-400'} />
              <div className="truncate text-sm font-medium text-gray-700">
                {chat.title || 'New Conversation'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
                <div className="spinner"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bot size={48} className="mb-4 text-blue-200" />
              <p className="text-lg font-medium">Start a new conversation with SGE AI</p>
              <p className="text-sm text-gray-400 mt-2">Ask anything about strategic growth and business insights</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={classNames('chat-message-wrapper', {
                  'chat-message-user-wrapper': msg.role === 'user'
                })}
              >
                <div className={classNames('chat-avatar', {
                    'chat-avatar-user': msg.role === 'user',
                    'chat-avatar-ai': msg.role !== 'user'
                })}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className="chat-message-content">
                  <div className={classNames('message-bubble', {
                    'message-user': msg.role === 'user',
                    'message-ai': msg.role !== 'user'
                  })}>
                    {msg.content}
                  </div>
                  {msg.created_at && (
                    <div className={classNames('chat-timestamp', {
                      'chat-timestamp-user': msg.role === 'user'
                    })}>
                      {formatTimestamp(msg.created_at)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {sending && (
             <div className="chat-message-wrapper">
                <div className="chat-avatar chat-avatar-ai">
                    <Bot size={16} />
                </div>
                <div className="chat-message-content">
                  <div className="message-bubble message-ai flex items-center gap-2">
                      <span className="chat-typing-dot"></span>
                      <span className="chat-typing-dot" style={{animationDelay: '0.2s'}}></span>
                      <span className="chat-typing-dot" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <div className="chat-input-wrapper">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input"
                disabled={sending}
              />
              <div className="chat-input-actions">
                <button
                  type="button"
                  onClick={handleMicClick}
                  disabled={sending}
                  className="chat-mic-button"
                  aria-label="Voice input (coming soon)"
                  title="Voice input - Coming soon"
                >
                  <Mic size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="chat-send-button"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </form>
          <div className="chat-disclaimer">
            <p className="text-xs text-gray-400">AI can make mistakes. Verify important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
