import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Plus, MessageSquare, Bot, User, Mic } from 'lucide-react';
import '../styles/Chat.css';
import { 
  getConversations, 
  getMessages, 
  createConversation as createConversationApi,
  sendMessage as sendMessageApi
} from '../services/chatService';

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
      const list = await getConversations();
      setConversations(list);
      if (list.length > 0 && !activeConversationId) {
        setActiveConversationId(list[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Keep current state; show no-op if failing
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
    if (!conversationId) return;
    setLoading(true);
    try {
      const list = await getMessages(conversationId);
      setMessages(list);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setSending(true);

    try {
      const result = await sendMessageApi(activeConversationId, tempMessage.content);
      // result contains: conversation_id, userMessage, assistantMessage
      if (!activeConversationId && result?.conversation_id) {
        // If conversation was created during send, set it as active and refresh conversation list
        setActiveConversationId(result.conversation_id);
        // Insert the new conversation at top optimistically with a generic title if not in list yet
        setConversations(prev => {
          const exists = prev.some(c => c.id === result.conversation_id);
          if (exists) return prev;
          const title = tempMessage.content.substring(0, 30) + (tempMessage.content.length > 30 ? '...' : '');
          const newConv = { id: result.conversation_id, title: title || 'New Conversation', created_at: new Date().toISOString() };
          return [newConv, ...prev];
        });
      }

      if (result?.assistantMessage) {
        setMessages(prev => {
          // Replace temp with actual stored userMessage if needed, then add assistant
          const withoutTemp = prev.filter(m => m.id !== tempMessage.id);
          const normalizedUser = result.userMessage ? result.userMessage : tempMessage;
          return [...withoutTemp, normalizedUser, result.assistantMessage];
        });
      } else {
        // Fallback to refetch to synchronize state
        fetchMessages(result?.conversation_id || activeConversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Rollback temp state by removing temp if error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
    } finally {
      setSending(false);
    }
  };

  const createNewChat = async () => {
    // Optimistic placeholder
    const tempId = `temp-${Date.now()}`;
    const placeholder = {
      id: tempId,
      title: 'New Conversation',
      created_at: new Date().toISOString(),
    };

    // Optimistically insert at top and set active
    setConversations(prev => [placeholder, ...prev]);
    setActiveConversationId(tempId);
    setMessages([]);

    try {
      const created = await createConversationApi('New Conversation');
      // Replace placeholder with real record
      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== tempId);
        return [created, ...filtered];
      });
      setActiveConversationId(created.id);
    } catch (err) {
      console.error('Failed to create conversation:', err);
      // Rollback optimistic addition
      setConversations(prev => prev.filter(c => c.id !== tempId));
      // Keep UI usable: reset active to previous first if exists
      setActiveConversationId(prev => {
        const first = conversations[0]?.id;
        return first || null;
      });
    }
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
