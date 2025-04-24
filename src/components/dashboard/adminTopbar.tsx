import React from "react";
import { Bell, UserCircle, ChevronDown } from "lucide-react";
import profilePic from "@/assets/Lotokari-Mukha.jpg"; // add a default avatar image

const AdminTopbar = () => {
    return (
        <header className="w-full bg-white dark:bg-zinc-900 shadow-sm px-4 md:px-8 py-4 sticky top-0 z-40 border-b 
        border-gray-200 dark:border-zinc-700 flex items-center justify-between">
            {/* Left Side - Brand or Spacer */}
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
                Admin Dashboard
            </h1>

            {/* Right Side - Notifications & Profile */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        aria-label="Notifications"
                    >
                        <Bell size={20} className="text-gray-700 dark:text-white" />
                    </button>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                </div>

                {/* Admin Profile */}
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 
                px-3 py-1 rounded-full transition">
                    <img
                        src={profilePic}
                        alt="Admin Avatar"
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-600 object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-white hidden sm:block">
                        Admin
                    </span>
                    <ChevronDown size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
