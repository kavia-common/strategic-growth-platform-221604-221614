import api from './api'

/**
 * PUBLIC_INTERFACE
 * getConversations
 * Fetch list of conversations for the authenticated user.
 */
export async function getConversations() {
  const res = await api.get('/api/chat/conversations')
  return res.data || []
}

/**
 * PUBLIC_INTERFACE
 * getMessages
 * Fetch messages for a given conversation.
 */
export async function getMessages(conversationId) {
  const res = await api.get(`/api/chat/conversations/${conversationId}/messages`)
  return res.data || []
}

/**
 * PUBLIC_INTERFACE
 * createConversation
 * Creates a new conversation. If backend returns the created row, it is used.
 * Optionally accepts a title; backend will default if omitted.
 */
export async function createConversation(title) {
  const res = await api.post('/api/chat/conversations', { title })
  return res.data
}

/**
 * PUBLIC_INTERFACE
 * sendMessage
 * Sends a message to a conversation. If conversationId is null, backend may create a new conversation.
 */
export async function sendMessage(conversationId, content) {
  const res = await api.post('/api/chat/message', {
    conversation_id: conversationId,
    content,
  })
  return res.data
}
