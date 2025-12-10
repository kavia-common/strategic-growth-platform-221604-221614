import api from './api';

// Verified: Uses the configured axios instance from api.js (resolves correct backend URL)

// PUBLIC_INTERFACE
/**
 * getConversations
 * Fetch list of conversations for the authenticated user.
 * Endpoint: GET /api/chat/conversations
 * Returns: Array of { id, title, created_at }
 */
export async function getConversations() {
  try {
    const res = await api.get('/api/chat/conversations');
    // Ensure we always return an array
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw formatApiError(err, 'Failed to fetch conversations');
  }
}

// PUBLIC_INTERFACE
/**
 * getMessages
 * Fetch messages for a given conversation.
 * Endpoint: GET /api/chat/conversations/:id/messages
 * Returns: Array of { id, conversation_id, role, content, created_at }
 */
export async function getMessages(conversationId) {
  if (!conversationId) return [];
  try {
    const res = await api.get(`/api/chat/conversations/${conversationId}/messages`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    throw formatApiError(err, 'Failed to fetch messages');
  }
}

// PUBLIC_INTERFACE
/**
 * createConversation
 * Creates a new conversation.
 * Endpoint: POST /api/chat/conversations
 * Returns: { id, title, created_at }
 */
export async function createConversation(title) {
  try {
    const res = await api.post('/api/chat/conversations', { title });
    return res.data;
  } catch (err) {
    throw formatApiError(err, 'Failed to create conversation');
  }
}

// PUBLIC_INTERFACE
/**
 * sendMessage
 * Sends a message to a conversation.
 * Endpoint: POST /api/chat/message
 * Request: { conversation_id, content }
 * Returns: { conversation_id, user_message, assistant_message }
 */
export async function sendMessage(conversationId, content) {
  try {
    const res = await api.post('/api/chat/message', {
      conversation_id: conversationId,
      content,
    });
    return res.data;
  } catch (err) {
    throw formatApiError(err, 'Failed to send message');
  }
}

/**
 * Convert axios error to a user-friendly error with details preserved.
 * PRIVATE helper.
 */
function formatApiError(err, fallbackMessage) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const message =
    data?.message ||
    data?.error ||
    (typeof data === 'string' ? data : '') ||
    err?.message ||
    fallbackMessage ||
    'Request failed';
  
  const error = new Error(message);
  error.status = status;
  error.details = data;
  return error;
}
