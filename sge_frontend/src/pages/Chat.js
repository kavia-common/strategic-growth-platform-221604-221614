import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Plus, MessageSquare, Bot, User, Mic, Edit2, Check, X } from 'lucide-react';
import '../styles/Chat.css';
import {
  getConversations,
  getMessages,
  createConversation as createConversationApi,
  sendMessage as sendMessageApi,
} from '../services/chatService';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
/**
 * Chat component - AI-powered chat interface with Foundatia brand styling
 * Left history column, right conversation area with gold accents
 * Features: conversation rename (local only), persistent chat history
 */
const Chat = () => {
  const { session } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef(null);
  const editInputRef = useRef(null);
  const justCreatedConversationId = useRef(null);
  const activeConversationIdRef = useRef(activeConversationId);

  // Keep ref in sync with state for use in callbacks
  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // Load custom titles from localStorage on mount
  useEffect(() => {
    const storedTitles = localStorage.getItem('chat_conversation_titles');
    if (storedTitles) {
      try {
        const titles = JSON.parse(storedTitles);
        // Apply stored titles to conversations
        setConversations((prev) =>
          prev.map((conv) => ({
            ...conv,
            title: titles[conv.id] || conv.title,
          }))
        );
      } catch (err) {
        console.error('Failed to load conversation titles:', err);
      }
    }
  }, []);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingConversationId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingConversationId]);

  // Simple toast helper
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  // Save custom title to localStorage
  const saveCustomTitle = (conversationId, title) => {
    try {
      const storedTitles = localStorage.getItem('chat_conversation_titles');
      const titles = storedTitles ? JSON.parse(storedTitles) : {};
      titles[conversationId] = title;
      localStorage.setItem('chat_conversation_titles', JSON.stringify(titles));
    } catch (err) {
      console.error('Failed to save conversation title:', err);
    }
  };

  // Start editing a conversation title
  const startEditingTitle = (conversationId, currentTitle) => {
    setEditingConversationId(conversationId);
    setEditingTitle(currentTitle || 'New Conversation');
  };

  // Confirm title edit
  const confirmTitleEdit = () => {
    if (!editingConversationId) return;

    const trimmedTitle = editingTitle.trim();
    
    // Validation: non-empty
    if (!trimmedTitle) {
      showError('Conversation title cannot be empty');
      return;
    }

    // Update conversation title in state
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === editingConversationId
          ? { ...conv, title: trimmedTitle }
          : conv
      )
    );

    // Save to localStorage
    saveCustomTitle(editingConversationId, trimmedTitle);

    // Reset editing state
    setEditingConversationId(null);
    setEditingTitle('');
  };

  // Cancel title edit
  const cancelTitleEdit = () => {
    setEditingConversationId(null);
    setEditingTitle('');
  };

  // Handle Enter key to confirm, Escape to cancel
  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmTitleEdit();
    } else if (e.key === 'Escape') {
      cancelTitleEdit();
    }
  };

  const fetchConversations = useCallback(async () => {
    // Guard: no session means we shouldn't call protected endpoints
    if (!session) {
      return;
    }
    try {
      const list = await getConversations();

      // Load custom titles from localStorage
      const storedTitles = localStorage.getItem('chat_conversation_titles');
      const customTitles = storedTitles ? JSON.parse(storedTitles) : {};

      // Apply custom titles to conversations
      const listWithCustomTitles = list.map((conv) => ({
        ...conv,
        title: customTitles[conv.id] || conv.title,
      }));

      setConversations((prev) => {
        const currentActiveId = activeConversationIdRef.current;

        // Preserve optimistic/temp conversations
        const temps = prev.filter((c) => c.id.toString().startsWith('temp-'));
        const listIds = new Set(listWithCustomTitles.map((c) => c.id));

        // Preserve active conversation if not in server list
        let preservedActive = null;
        if (currentActiveId && !listIds.has(currentActiveId)) {
          preservedActive = prev.find((c) => c.id === currentActiveId);
        }

        const uniqueTemps = temps.filter((t) => !listIds.has(t.id));

        let newList = [...uniqueTemps, ...listWithCustomTitles];

        if (preservedActive && !newList.some((c) => c.id === preservedActive.id)) {
          newList = [preservedActive, ...newList];
        }

        return newList;
      });

      // Update active ID selection logic
      setActiveConversationId((prev) => {
        if (justCreatedConversationId.current && prev === justCreatedConversationId.current) {
          return prev;
        }

        if (!prev && list.length > 0) return list[0].id;

        return prev;
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      const details = error?.details || error?.message || '';
      showError(`Failed to load conversations${details ? `: ${details}` : ''}`);
    }
  }, [session]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConversationId) {
      if (activeConversationId.toString().startsWith('temp-')) {
        setMessages([]);
      } else {
        if (justCreatedConversationId.current === activeConversationId) {
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
    if (!session) return;
    if (!conversationId) return;
    if (conversationId.toString().startsWith('temp-')) return;

    setLoading(true);
    try {
      const list = await getMessages(conversationId);
      setMessages(list);
    } catch (error) {
      console.error('Error fetching messages:', error);
      const details = error?.details || error?.message || '';
      showError(`Failed to load messages${details ? `: ${details}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!session) {
      showError('You must be signed in to send messages');
      return;
    }
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');
    setSending(true);

    try {
      const isTempId = activeConversationId && activeConversationId.toString().startsWith('temp-');
      const targetId = isTempId ? null : activeConversationId;

      const result = await sendMessageApi(targetId, tempMessage.content);

      const { conversation_id, user_message, assistant_message } = result || {};

      if (!conversation_id) {
        throw new Error('Invalid response from server');
      }

      if ((!activeConversationId || isTempId) && conversation_id) {
        justCreatedConversationId.current = conversation_id;
        setActiveConversationId(conversation_id);

        setConversations((prev) => {
          if (isTempId) {
            return prev.map((c) =>
              c.id === activeConversationId
                ? { ...c, id: conversation_id, title: tempMessage.content.substring(0, 30) }
                : c
            );
          }
          const exists = prev.some((c) => c.id === conversation_id);
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
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempMessage.id);
          const realUserMsg = user_message || tempMessage;
          return [...withoutTemp, realUserMsg, assistant_message];
        });
      } else {
        fetchMessages(conversation_id || activeConversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const msg = error.message || error.toString();
      showError(`Failed to send message: ${msg}`);
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      setNewMessage(tempMessage.content);
    } finally {
      setSending(false);
    }
  };

  const createNewChat = async () => {
    if (!session) {
      showError('You must be signed in to create a conversation');
      return;
    }
    const tempId = `temp-${Date.now()}`;
    const placeholder = {
      id: tempId,
      title: 'New Conversation',
      created_at: new Date().toISOString(),
    };

    setConversations((prev) => [placeholder, ...prev]);
    setActiveConversationId(tempId);
    setMessages([]);

    try {
      const created = await createConversationApi('New Conversation');

      if (created?.id) {
        setConversations((prev) => prev.map((c) => (c.id === tempId ? created : c)));
        justCreatedConversationId.current = created.id;
        setActiveConversationId(created.id);
        setMessages([]);
      } else {
        await fetchConversations();
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      const msg = err.message || err.toString();
      showError(`Failed to create conversation: ${msg}`);
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
        <div
          style={{
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
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* Left History Sidebar */}
      <div className="chat-history-sidebar">
        <div className="chat-history-header">
          <button onClick={createNewChat} className="chat-new-conversation-btn">
            <Plus size={18} strokeWidth={2.5} />
            New Conversation
          </button>
        </div>

        <div className="chat-history-list">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`chat-history-item ${activeConversationId === chat.id ? 'active' : ''}`}
            >
              {editingConversationId === chat.id ? (
                // Editing mode
                <div className="chat-history-edit-wrapper">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    className="chat-history-edit-input"
                    maxLength={50}
                  />
                  <div className="chat-history-edit-actions">
                    <button
                      onClick={confirmTitleEdit}
                      className="chat-history-edit-btn confirm"
                      title="Confirm (Enter)"
                      aria-label="Confirm rename"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={cancelTitleEdit}
                      className="chat-history-edit-btn cancel"
                      title="Cancel (Esc)"
                      aria-label="Cancel rename"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <>
                  <div
                    onClick={() => setActiveConversationId(chat.id)}
                    className="chat-history-clickable"
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingTitle(chat.id, chat.title);
                    }}
                    className="chat-history-rename-btn"
                    title="Rename conversation"
                    aria-label="Rename conversation"
                  >
                    <Edit2 size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Conversation Area */}
      <div className="chat-conversation-area">
        <div className="chat-messages-container">
          <div className="chat-messages-inner">
            {messages.length === 0 && loading ? (
              <div className="chat-empty-state">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(227, 183, 106, 0.2)',
                    borderTopColor: '#E3B76A',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
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
                    <div
                      className={`chat-message-avatar ${msg.role === 'user' ? 'user' : 'ai'}`}
                    >
                      {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>

                    <div className="chat-message-content">
                      <div
                        className={`chat-message-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}
                      >
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
