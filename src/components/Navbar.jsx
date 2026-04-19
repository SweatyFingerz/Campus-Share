import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  BookOpen,
  Search,
  LayoutDashboard,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: <BookOpen size={18} /> },
    { to: "/library", label: "Library", icon: <Search size={18} /> },
    { to: "/lost-found", label: "Lost & Found", icon: <Search size={18} /> },
  ];

  if (isAuthenticated) {
    navLinks.push({
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CampusShare
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user?.displayName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-200"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg animate-in slide-in-from-top">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
