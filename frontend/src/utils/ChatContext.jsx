import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  listChats,
  createChat,
  getChat,
  addMessage,
  deleteChat as apiDeleteChat,
  renameChat as apiRenameChat,
} from "../apis/user";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const fetchChats = useCallback(async () => {
    if (isAuthenticated){
      const data = await listChats();
      if (data.length === 0) {
        const newChat = await createChat({ name: "New Chat", messages: [] });
        setChats([newChat]);
        setActiveChat(newChat);
      } else {
        setChats(data);
        setActiveChat((prev) =>
          prev && data.find((c) => c.chat_id === prev.chat_id) ? prev : data[0]
        );
      }
    }
  }, [isAuthenticated]);

  const startNewChat = useCallback(async (name = "New Chat") => {
    const newChat = await createChat({ name, messages: [] });
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat);
    return newChat;
  }, []);

  const openChat = useCallback(async (chat_id) => {
    const chat = await getChat(chat_id);
    setActiveChat(chat);
  }, []);

  const sendMessage = useCallback(async (chat_id, content, type = "user") => {
    await addMessage({ chatId: chat_id, content, type });
    const updated = await getChat(chat_id);
    setActiveChat(updated);
    setChats((prev) => prev.map((c) => (c.chat_id === chat_id ? updated : c)));
  }, []);

  const deleteChat = useCallback(
    async (chat_id) => {
      await apiDeleteChat(chat_id);
      setChats((prev) => prev.filter((c) => c.chat_id !== chat_id));
      if (activeChat?.chat_id === chat_id) {
        const remaining = chats.filter((c) => c.chat_id !== chat_id);
        setActiveChat(remaining[0] || null);
      }
    },
    [activeChat, chats]
  );

  const renameChat = useCallback(
    async (chat_id, newName) => {
      const updated = await apiRenameChat(chat_id, newName);
      setChats((prev) =>
        prev.map((c) => (c.chat_id === chat_id ? updated : c))
      );
      if (activeChat?.chat_id === chat_id) {
        setActiveChat(updated);
      }
    },
    [activeChat]
  );

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const resetChats = () => {
    setChats([]);
    setActiveChat(null);
  };

  useEffect(() => {
    if (accessToken && isAuthenticated) {
      fetchChats();
    } else {
      resetChats(); // Clear chats when no token
    }
  }, [isAuthenticated]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        fetchChats,
        startNewChat,
        openChat,
        sendMessage,
        deleteChat,
        renameChat,
        resetChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChats = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChats must be inside ChatProvider");
  return ctx;
};
