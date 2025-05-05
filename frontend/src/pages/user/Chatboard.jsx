import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChats } from '../../utils/ChatContext';
import { getSuggestions } from '../../apis/user';

const Chatboard = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const {
    chats,
    activeChat,
    openChat,
    fetchChats,
    sendMessage,
    deleteChat,
    renameChat,
  } = useChats();

  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      await openChat(chatId);
    })();
  }, [chatId, openChat]);

  useEffect(() => {
    if (activeChat && activeChat.chat_id === chatId && activeChat.messages.length === 0) {
      (async () => {
        const s = await getSuggestions();
        setSuggestions(s);
      })();
    } else {
      setSuggestions([]);
    }
  }, [activeChat, chatId]);

  const handleSend = async (e, contentOverride = null) => {
    if (e) e.preventDefault();
    const content = contentOverride ?? draft.trim();
    if (!content) return;
    await sendMessage(chatId, content, 'user');
    await fetchChats();
    setDraft('');
    setSuggestions([]);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this chat?')) {
      await deleteChat(chatId);
      await fetchChats();
      const remaining = chats.filter(c => c.chat_id !== chatId);
      if (remaining.length) navigate(`/chat/${remaining[0].chat_id}`);
      else navigate('/');
    }
  };

  const handleRenameSubmit = () => {
    if (editText.trim()) renameChat(chatId, editText.trim());
    setEditing(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {editing ? (
          <input
            className="p-2 rounded bg-gray-700 text-white flex-1 mr-2"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={e => e.key === 'Enter' && handleRenameSubmit()}
            autoFocus
          />
        ) : (
          <h2 className="text-white text-xl">{activeChat.name}</h2>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditing(true);
              setEditText(activeChat.name);
            }}
            className="px-3 py-1 bg-gray-700 rounded text-gray-200 hover:bg-gray-600 cursor-pointer"
          >
            Rename
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Chat Messages or Suggestions */}
      <div className="flex-1 overflow-auto space-y-2 mb-4 flex flex-col">
        {activeChat.messages.length === 0 && suggestions.length > 0 ? (
          <div className="space-y-2 text-white">
            <p className="text-gray-400">Try one of these:</p>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={(e) => handleSend(null, s)}
                className="text-left p-2 rounded bg-white text-gray-900  hover:text-white hover:bg-gray-600 w-full cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          activeChat.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded w-fit max-w-[90%] ${
                msg.type === 'user'
                  ? 'bg-blue-600 self-end text-white'
                  : 'bg-gray-700 self-start text-white'
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#CE93D8] text-[#121212] rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatboard;
