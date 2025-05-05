import { useRef, useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useChats } from "../utils/ChatContext";
import { showSuccess } from "../utils/helper";
import Logo from "../assets/logo.png";
import { FaBars, FaEllipsisV } from "react-icons/fa";

const UserLayout = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const location = useLocation();
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const logoRef = useRef();
  const {
    chats,
    startNewChat,
    deleteChat,
    renameChat,
    openChat,
    resetChats,
  } = useChats();

  const wrapperRef = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpenFor(null);
      }
      if (logoRef.current && !logoRef.current.contains(e.target)) {
        setLogoMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRenameSubmit = (chat_id) => {
    if (editText.trim()) renameChat(chat_id, editText.trim());
    setEditingId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full h-16 bg-gray-800 flex items-center px-4 text-white z-10">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="p-2 hover:bg-gray-700 rounded transition"
        >
          <FaBars size={20} className="text-white" />
        </button>
        <h4 className="ml-4 font-semibold">Chatbot</h4>
        <div className="flex-1" />
        <div className="relative" ref={logoRef}>
          <img
            className="h-10 rounded-full cursor-pointer"
            src={Logo}
            alt="User"
            onClick={() => setLogoMenuOpen((v) => !v)}
          />

          {logoMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg z-20">
              <button
                onClick={() => {
                  resetChats();
                  logout();
                  showSuccess("Logged out");
                }}
                className="flex items-center w-full text-left px-4 py-2 cursor-pointer text-gray-300 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside
            className="bg-gray-800 w-48 shadow-lg px-2 pt-4 fixed left-0 bottom-0 top-16 z-20"
            ref={wrapperRef}
          >
            <button
              className="w-full text-center px-4 py-2 cursor-pointer rounded mb-5 text-gray-900 bg-white hover:bg-gray-100"
              onClick={() => startNewChat("New Chat")}
            >
              Create New Chat
            </button>
            {chats.map(({ chat_id, name }) => (
              <div key={chat_id} className="relative group flex justify-center">
                {editingId === chat_id ? (
                  <input
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-1"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => handleRenameSubmit(chat_id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRenameSubmit(chat_id);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <Link
                    to={`/chat/${chat_id}`}
                    onClick={() => openChat(chat_id)}
                    className={`block px-4 py-2 pr-10 rounded transition-colors w-full ${
                      location.pathname === `/chat/${chat_id}`
                        ? "bg-[#CE93D8] text-[#121212]"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {name}
                  </Link>
                )}

                <div
                  style={{ transform: "translateY(12.5%)" }}
                  className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition"
                  onClick={() =>
                    setMenuOpenFor(menuOpenFor === chat_id ? null : chat_id)
                  }
                >
                  <FaEllipsisV className="text-white cursor-pointer" />
                </div>

                {menuOpenFor === chat_id && (
                  <div className="absolute top-6 right-2 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg z-30">
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                      onClick={() => {
                        setEditingId(chat_id);
                        setEditText(name);
                        setMenuOpenFor(null);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete chat “${name}”? This cannot be undone.`
                          )
                        ) {
                          deleteChat(chat_id);
                        }
                        setMenuOpenFor(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </aside>
        )}

        {/* Main area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "md:ml-48" : ""
          } p-4 bg-gray-900`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
