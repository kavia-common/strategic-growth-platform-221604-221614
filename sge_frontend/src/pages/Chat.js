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
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const justCreatedConversationId = useRef(null);

  // Simple toast helper
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  const fetchConversations = useCallback(async () => {
    try {
      const list = await getConversations();
      // Preserve optimistic conversations (starting with temp- or conv-)
      setConversations(prev => {
        // Filter out old temp ones if they are not active? 
        // Logic: merge server list with any temp items not in server list
        const temps = prev.filter(c => c.id.toString().startsWith('temp-'));
        const listIds = new Set(list.map(c => c.id));
        const uniqueTemps = temps.filter(t => !listIds.has(t.id));
        
        // If the active conversation is not in the new list and not temp, 
        // it might have been deleted or we are in a weird state. 
        return [...uniqueTemps, ...list];
      });
      
      // Only set active if none selected and list available
      setActiveConversationId(prev => {
        if (!prev && list.length > 0) return list[0].id;
        // Check if prev exists in list or is temp
        const stillExists = list.find(c => c.id === prev) || prev?.toString().startsWith('temp-');
        if (prev && !stillExists && list.length > 0) return list[0].id;
        return prev;
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      showError('Failed to load conversations');
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConversationId) {
      // Don't clear messages immediately to prevent flash if it's the same convo re-rendering
      // But here activeConversationId changed.
      // Check if it's a temp id, if so clear messages (it's new)
      if (activeConversationId.toString().startsWith('temp-')) {
         setMessages([]);
      } else {
         // Check if we just created this conversation to skip fetch/loading
         if (justCreatedConversationId.current === activeConversationId) {
           // Reset the ref so future refetches (e.g. clicking away and back) work
           justCreatedConversationId.current = null;
           return;
         }
         fetchMessages(activeConversationId);
      }
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
    if (conversationId.toString().startsWith('temp-')) return;

    setLoading(true);
    try {
      const list = await getMessages(conversationId);
      setMessages(list);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showError('Failed to load messages');
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
      // If activeConversationId is temp, send null to create new
      const isTempId = activeConversationId && activeConversationId.toString().startsWith('temp-');
      const targetId = isTempId ? null : activeConversationId;

      const result = await sendMessageApi(targetId, tempMessage.content);
      
      // Expected shape: { conversation_id, user_message, assistant_message }
      const { conversation_id, user_message, assistant_message } = result || {};

      if (!conversation_id) {
          throw new Error('Invalid response from server');
      }

      if ((!activeConversationId || isTempId) && conversation_id) {
        justCreatedConversationId.current = conversation_id;
        setActiveConversationId(conversation_id);
        
        // Update conversation list item from temp to real
        setConversations(prev => {
          if (isTempId) {
             return prev.map(c => c.id === activeConversationId ? { ...c, id: conversation_id, title: tempMessage.content.substring(0,30) } : c);
          }
          const exists = prev.some(c => c.id === conversation_id);
          if (exists) return prev;
          
          const newConv = {
            id: conversation_id,
            title: tempMessage.content.substring(0, 30) || 'New Conversation',
            created_at: new Date().toISOString(),
          };
          return [newConv, ...prev];
        });
      }

      if (assistant_message) {
        setMessages(prev => {
          // Remove the temp user message
          const withoutTemp = prev.filter(m => m.id !== tempMessage.id);
          
          // Use the real user message from server (if available) or temp
          const realUserMsg = user_message || tempMessage;
          
          // Append real user msg + assistant msg
          return [...withoutTemp, realUserMsg, assistant_message];
        });
      } else {
        // Fallback
        fetchMessages(conversation_id || activeConversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const msg = error.message || error.toString();
      showError(`Failed to send message: ${msg}`);
      // Rollback: remove message bubble but restore input text so user doesn't lose it
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      setNewMessage(tempMessage.content);
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

    setConversations(prev => [placeholder, ...prev]);
    setActiveConversationId(tempId);
    setMessages([]);

    try {
      const created = await createConversationApi('New Conversation');
      // created shape: { id, title, created_at }
      
      if (created?.id) {
        // Replace placeholder with real record
        setConversations(prev => prev.map(c => c.id === tempId ? created : c));
        justCreatedConversationId.current = created.id;
        setActiveConversationId(created.id);
        // Messages are empty for new chat
        setMessages([]);
      } else {
        // Fallback
        await fetchConversations();
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      const msg = err.message || err.toString();
      showError(`Failed to create conversation: ${msg}`);
      // Do NOT rollback optimistic addition to preserve state as requested
      // setConversations(prev => prev.filter(c => c.id !== tempId));
      // setActiveConversationId(prev => conversations[0]?.id || null);
    }
  };

  const handleMicClick = () => {
    showError('Voice input coming soon');
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="chat-page">
      {/* Toast Notification */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#EF4444',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease',
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

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
