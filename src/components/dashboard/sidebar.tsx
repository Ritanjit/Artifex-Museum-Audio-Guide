// src/components/AdminSidebar.tsx
import React, { useState } from "react";
import {
  Upload,
  MessageSquare,
  CalendarCheck,
  Music,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { name: "Upload to Collections", icon: <Upload />, path: "/admin/upload" },
  { name: "View Feedback", icon: <MessageSquare />, path: "/admin/feedback" },
  { name: "Edit Events", icon: <CalendarCheck />, path: "/admin/events" },
  { name: "Audio Player Page", icon: <Music />, path: "/admin/audio" },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <span className={`text-xl font-bold text-amber-400 ${!isOpen && "hidden"}`}>Admin Panel</span>
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
                {isOpen && <span className="text-sm font-medium">{tab.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Placeholder */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {/* Content will go here when routed */}
      </div>
    </div>
  );
};

export default AdminSidebar;
