import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useChats } from "../utils/ChatContext"; 
import { showSuccess } from "../utils/helper";
import Logo from "../assets/logo.png";

const DefaultLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const { activeChat, startNewChat, resetChats } = useChats();  
  const navigate = useNavigate();

  const handleLogout = () => {
    resetChats();
    logout();
    showSuccess("Logged out successfully");
  };

  const goToChatboard = async () => {
    if (activeChat) {
      navigate(`/chat/${activeChat.chat_id}`);
    } else {
      const newChat = await startNewChat();
      navigate(`/chat/${newChat.chat_id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white shadow">
        <div className="flex items-center gap-2">
          <img
            className="h-12 w-12 rounded-full cursor-pointer"
            src={Logo}
            alt="Chatbot Logo"
          />
          <h4 className="text-lg font-semibold">Chatbot</h4>
        </div>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button
                onClick={goToChatboard}
                className="hover:underline text-white cursor-pointer"
              >
                Chatboard
              </button>
              <button onClick={handleLogout} className="hover:underline cursor-pointer">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
