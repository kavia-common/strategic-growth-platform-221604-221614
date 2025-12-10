import api from './api'

// Verified: Uses the configured axios instance from api.js (resolves correct backend URL)

/**
 * PUBLIC_INTERFACE
 * getConversations
 * Fetch list of conversations for the authenticated user.
 */
export async function getConversations() {
  try {
    const res = await api.get('/api/chat/conversations');
    return res.data || [];
  } catch (err) {
    // Surface error for UI handling
    throw formatApiError(err, 'Failed to fetch conversations');
  }
}

/**
 * PUBLIC_INTERFACE
 * getMessages
 * Fetch messages for a given conversation.
 */
export async function getMessages(conversationId) {
  try {
    const res = await api.get(`/api/chat/conversations/${conversationId}/messages`);
    return res.data || [];
  } catch (err) {
    throw formatApiError(err, 'Failed to fetch messages');
  }
}

/**
 * PUBLIC_INTERFACE
 * createConversation
 * Creates a new conversation. If backend returns the created row, it is used.
 * Optionally accepts a title; backend will default if omitted.
 */
export async function createConversation(title) {
  try {
    const res = await api.post('/api/chat/conversations', { title });
    return res.data;
  } catch (err) {
    throw formatApiError(err, 'Failed to create conversation');
  }
}

/**
 * PUBLIC_INTERFACE
 * sendMessage
 * Sends a message to a conversation. If conversationId is null, backend may create a new conversation.
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
    data ||
    err?.message ||
    fallbackMessage ||
    'Request failed';
  const error = new Error(message);
  error.status = status;
  error.details = data;
  return error;
}
