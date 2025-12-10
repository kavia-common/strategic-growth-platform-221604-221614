import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { Send, Plus, MessageSquare, Bot, User, Mic } from 'lucide-react';
import '../styles/Chat.css';

// PUBLIC_INTERFACE
/**
 * Chat component - AI-powered chat interface with Foundatia brand styling
 * Left history column, right conversation area with gold accents
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
      const response = await api.get('/api/chat/conversations');
      setConversations(response.data);
      if (response.data.length > 0 && !activeConversationId) {
        setActiveConversationId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback mock data
      setConversations([
        { id: 1, title: 'Strategic Growth Planning', created_at: new Date().toISOString() },
        { id: 2, title: 'Market Analysis Q4', created_at: new Date().toISOString() },
        { id: 3, title: 'Competitive Insights', created_at: new Date().toISOString() }
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
        { 
          id: 1, 
          role: 'user', 
          content: 'What are the key growth opportunities for our business?', 
          created_at: new Date().toISOString() 
        },
        { 
          id: 2, 
          role: 'assistant', 
          content: 'Based on the strategic analysis, there are three key growth opportunities: 1) Expanding into emerging markets with high demand, 2) Developing innovative product lines that address unmet customer needs, and 3) Leveraging partnerships to accelerate market penetration. Each of these strategies aligns with your core competencies and can drive sustainable growth.', 
          created_at: new Date().toISOString() 
        }
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
      const response = await api.post('/api/chat/message', {
        conversation_id: activeConversationId,
        content: tempMessage.content
      });

      if (response.data && response.data.role === 'assistant') {
        setMessages(prev => [...prev, response.data]);
      } else {
        fetchMessages(activeConversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Mock response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: "I understand you're asking about: " + tempMessage.content + ". Let me provide you with strategic insights based on available data and best practices.",
          created_at: new Date().toISOString()
        }]);
      }, 1000);
    } finally {
      setSending(false);
    }
  };

  const createNewChat = async () => {
    const newChat = { 
      id: Date.now(), 
      title: 'New Conversation', 
      created_at: new Date().toISOString() 
    };
    setConversations([newChat, ...conversations]);
    setActiveConversationId(newChat.id);
    setMessages([]);
  };

  const handleMicClick = () => {
    console.log('Voice input - feature coming soon');
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="chat-page">
      
      {/* Left History Sidebar */}
      <div className="chat-history-sidebar">
        <div className="chat-history-header">
          <button 
            onClick={createNewChat}
            className="chat-new-conversation-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            New Conversation
          </button>
        </div>
        
        <div className="chat-history-list">
          {conversations.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveConversationId(chat.id)}
              className={`chat-history-item ${activeConversationId === chat.id ? 'active' : ''}`}
            >
              <div className="chat-history-icon">
                <MessageSquare size={18} />
              </div>
              <div className="chat-history-content">
                <h4 className="chat-history-title">{chat.title || 'New Conversation'}</h4>
                <p className="chat-history-date">
                  {new Date(chat.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Conversation Area */}
      <div className="chat-conversation-area">
        <div className="chat-messages-container">
          <div className="chat-messages-inner">
            
            {loading ? (
              <div className="chat-empty-state">
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '3px solid rgba(227, 183, 106, 0.2)',
                  borderTopColor: '#E3B76A',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : messages.length === 0 ? (
              <div className="chat-empty-state">
                <Bot className="chat-empty-icon" size={64} />
                <h3 className="chat-empty-title">Start a Conversation</h3>
                <p className="chat-empty-subtitle">
                  Ask me anything about strategic growth and business insights
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`}
                  >
                    <div className={`chat-message-avatar ${msg.role === 'user' ? 'user' : 'ai'}`}>
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    
                    <div className="chat-message-content">
                      <div className={`chat-message-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                        {msg.content}
                      </div>
                      {msg.created_at && (
                        <div className="chat-message-timestamp">
                          {formatTimestamp(msg.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {sending && (
                  <div className="chat-message ai">
                    <div className="chat-message-avatar ai">
                      <Bot size={18} />
                    </div>
                    <div className="chat-message-content">
                      <div className="chat-message-bubble ai">
                        <div className="chat-typing-indicator">
                          <span className="chat-typing-dot"></span>
                          <span className="chat-typing-dot"></span>
                          <span className="chat-typing-dot"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area with Gold Send Button */}
        <div className="chat-input-area">
          <div className="chat-input-container">
            <form onSubmit={handleSendMessage}>
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
                    className="chat-mic-btn"
                    aria-label="Voice input (coming soon)"
                    title="Voice input - Coming soon"
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="chat-send-btn"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </form>
            <div className="chat-disclaimer">
              <p className="chat-disclaimer-text">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
