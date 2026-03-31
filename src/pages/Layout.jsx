import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

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
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

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
