import { useRef, useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { showSuccess } from '../utils/helper';
import Logo from "../assets/logo.png";

const Layout = () => {
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
 
    const navItems = [
        { name: 'Chatboard', href: "/chat" },
    ];

    const handleLogout = () => {
        logout();
        showSuccess("Logged out successfully");
        setDropdownOpen(false);
    };

    // Ref for the dropdown container to handle click outside
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-800 shadow-md z-10 flex items-center px-4 text-white">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <span className="text-sm p-2 text-white">
                        <i className="pi pi-align-left"></i>
                    </span>
                </button>
                <h4 className="ml-2 font-semibold">Chatbot</h4>
                <div className="flex-1 bg-gray-100" />
                <div className="relative" ref={dropdownRef}>
                    <img
                        className="h-10 rounded-full cursor-pointer"
                        src={Logo}
                        alt="User Logo"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg z-20">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                            >
                                <i className="pi pi-sign-out mr-2"></i> Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <aside
                    className={`bg-gray-800 shadow-lg transform transition-all duration-300 fixed left-0 bottom-0 top-16 z-20 ${
                        isSidebarOpen ? 'w-48 translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
                >
                    <div className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center p-3 rounded-lg transition-colors ${
                                    location.pathname === item.href
                                        ? 'bg-[#CE93D8] text-[#121212]'
                                        : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`${isSidebarOpen ? 'opacity-100 inline' : 'opacity-0 hidden'} transition`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 transition-all duration-300 ${
                        isSidebarOpen ? 'md:ml-48' : 'md:ml-28'
                    } p-4 bg-gray-900`}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
