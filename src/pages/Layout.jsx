
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PenTool, Home, User, Eye, EyeOff, LogIn, LogOut, UserCircle } from "lucide-react";
import { User as UserEntity } from "@/api/entities";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [adminViewMode, setAdminViewMode] = useState(true);
  
  useEffect(() => {
    loadUser();
    // Load admin view preference from localStorage
    const savedViewMode = localStorage.getItem('adminViewMode');
    if (savedViewMode !== null) {
      setAdminViewMode(JSON.parse(savedViewMode));
    }
  }, []);

  const loadUser = async () => {
    setIsAuthLoading(true);
    try {
      const user = await UserEntity.me();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
    setIsAuthLoading(false);
  };

  const handleLogin = async () => {
    try {
      await UserEntity.loginWithRedirect(window.location.href);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await UserEntity.logout();
      setCurrentUser(null);
      // Reload page to reset any cached state
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleAdminView = () => {
    const newMode = !adminViewMode;
    setAdminViewMode(newMode);
    localStorage.setItem('adminViewMode', JSON.stringify(newMode));
  };
  
  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  const isAdmin = currentUser?.role === 'admin';
  const showAdminFeatures = isAdmin && adminViewMode;

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          :root {
            --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          body {
            font-family: var(--font-inter);
            line-height: 1.6;
            letter-spacing: -0.01em;
          }
          
          .elegant-shadow {
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px 0 rgba(0, 0, 0, 0.02);
          }
          
          .elegant-shadow-lg {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          }
        `}
      </style>
      
      {/* Navigation Header */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Blog")} className="group">
              <h1 className="text-2xl font-light text-gray-900 tracking-tight group-hover:text-gray-600 transition-colors duration-200">
                Hundred Acre Wood
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-light">a record of projects</p>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link 
                to={createPageUrl("Blog")}
                className={`flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:text-gray-900 ${
                  isActive("Blog") ? "text-gray-900 border-b-2 border-gray-900 pb-1" : "text-gray-600"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              {showAdminFeatures && (
                <Link 
                  to={createPageUrl("Write")}
                  className={`flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:text-gray-900 ${
                    isActive("Write") ? "text-gray-900 border-b-2 border-gray-900 pb-1" : "text-gray-600"
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Write</span>
                </Link>
              )}

              {/* Authentication Section */}
              {isAuthLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              ) : currentUser ? (
                <div className="flex items-center space-x-4">
                  {/* Admin View Toggle */}
                  {isAdmin && (
                    <Button
                      onClick={toggleAdminView}
                      variant="ghost"
                      size="sm"
                      className={`flex items-center space-x-2 text-xs transition-all duration-200 rounded-full ${
                        adminViewMode 
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                      title={adminViewMode ? "Switch to User View" : "Switch to Admin View"}
                    >
                      {adminViewMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{adminViewMode ? "Admin" : "User"} View</span>
                    </Button>
                  )}

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 text-sm hover:bg-gray-100 rounded-full px-3 py-2">
                        <UserCircle className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">
                          Logged in as <span className="font-medium">{currentUser.full_name}</span>
                        </span>
                        {isAdmin && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Admin</span>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="flex items-center space-x-2 cursor-default">
                        <UserCircle className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{currentUser.full_name}</p>
                          <p className="text-xs text-gray-500">{currentUser.email}</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Mode Indicator */}
      {isAdmin && !adminViewMode && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-4xl mx-auto px-6 py-2">
            <div className="flex items-center justify-center space-x-2 text-xs text-amber-700">
              <EyeOff className="w-3 h-3" />
              <span>Viewing as regular user • Admin features hidden</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-gray-500 text-sm font-light">
              A space for thoughtful projects and professional insights.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              © {new Date().getFullYear()} Ryan Kolean. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
