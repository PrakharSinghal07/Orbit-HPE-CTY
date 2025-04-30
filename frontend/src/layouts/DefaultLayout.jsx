import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { showSuccess } from "../utils/helper";
import Logo from "../assets/logo.png";

const DefaultLayout = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully");
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
              <Link
                to={"/chat"}
                className="hover:underline"
              >
                Chatboard
              </Link>
              <button onClick={handleLogout} className="hover:underline">
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
