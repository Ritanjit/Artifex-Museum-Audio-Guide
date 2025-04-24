// src/components/AdminSidebar.tsx
import React, { useState } from "react";
import {
  Upload,
  MessageSquare,
  CalendarCheck,
  Music,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { name: "Home", icon: <Home size={24} />, path: "/admin/dashboard" },
  { name: "Upload", icon: <Upload size={24} />, path: "/admin/upload" },
  { name: "Feedback", icon: <MessageSquare size={24} />, path: "/admin/feedbackAdmin" },
  { name: "Events", icon: <CalendarCheck size={24} />, path: "/admin/eventsAdmin" },
  { name: "Audio Player", icon: <Music size={24} />, path: "/admin/playerAdmin" },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex z-50 h-screen">
        <div
          className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${
            isOpen ? "w-64" : "w-16"
          } flex flex-col`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
            <span
              className={`text-xl font-bold text-amber-400 ${
                !isOpen && "hidden"
              }`}
            >
              Admin Panel
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          <nav className="mt-4 flex-1 space-y-1">
            {tabs.map((tab, idx) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={idx}
                  to={tab.path}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition ${
                    isActive ? "bg-gray-800 border-l-4 border-amber-400" : ""
                  }`}
                >
                  <div className="text-amber-400">{tab.icon}</div>
                  {isOpen && (
                    <span className="text-sm font-medium">{tab.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Navbar for Mobile Only */}
      <div
        className="fixed bottom-0 left-0 w-full z-50 bg-gray-900 border-t border-gray-700 
        flex justify-around items-center py-3 md:hidden"
      >
        {tabs.map((tab, idx) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={idx}
              to={tab.path}
              className={`flex flex-col items-center text-xs transition-all ${
                isActive ? "text-amber-400 font-bold" : "text-white hover:text-amber-500"
              }`}
            >
              {tab.icon}
              <span className="mt-1">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default AdminSidebar;
