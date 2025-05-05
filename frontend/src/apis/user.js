// src/apis/user.js
import api from './index';

/**
 * Fetch all chats for the current user.
 * GET /chats
 */
export const listChats = async () => {
  const response = await api.get('/chats/');
  return response.data;
};

/**
 * Create a new chat with an optional name and initial messages.
 * POST /chats
 */
export const createChat = async ({ name, messages = [] }) => {
  const response = await api.post('/chats/', { name, messages });
  return response.data;
};

/**
 * Fetch a single chat by its chat_id.
 * GET /chats/:chatId
 */
export const getChat = async (chatId) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
};

/**
 * Append a message to a chat.
 * POST /chats/:chatId/messages
 */
export const addMessage = async ({ chatId, content, type }) => {
  const response = await api.post(`/chats/${chatId}/messages`, { content, type });
  return response.data;
};

/**
 * Delete a chat.
 * DELETE /chats/:chatId
 */
export const deleteChat = async (chatId) => {
  await api.delete(`/chats/${chatId}`);
};


/**
 * Rename an existing chat
 */
export const renameChat = async (chatId, newName) => {
  const { data } = await api.patch(`/chats/${chatId}`, { name: newName });
  return data;
};

/**
 * Fetch three LLM suggestions.
 * GET /chats/suggestions
 */
export const getSuggestions = async () => {
  const { data } = await api.get('/chats/suggestions');
  return data;  // array of strings
};