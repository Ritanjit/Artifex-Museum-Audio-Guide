// src/components/AdminSidebar.tsx
import React, { useState } from "react";
import {
  Home,
  CloudUpload,
  UserRoundPen,
  CircleFadingArrowUp,
  MessageSquare,
  CalendarCheck,
  Newspaper,
  MoreHorizontal,
  X,
  ChevronUp,
  Menu,
  Contact
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PanelLeftCloseIcon } from "../ui/panelClose";
import { HomeIcon } from "../../components/ui/home";
import AdminVisitorCounter from "../visitorCounter/AdminVisitorCounter";
import { useTheme } from "@/components/theme-provider/theme-provider";

const tabs = [
  { name: "Home", icon: <HomeIcon size={20} />, path: "/admin", primary: true },
  { name: "Upload", icon: <CircleFadingArrowUp size={20} />, path: "/admin/uploadManager", primary: true },
  { name: "Manager", icon: <UserRoundPen size={20} />, path: "/admin/artifactManager", primary: true },
  { name: "Feedback", icon: <MessageSquare size={20} />, path: "/admin/feedbackAdmin", primary: true },
  { name: "Events", icon: <CalendarCheck size={20} />, path: "/admin/eventsAdmin" },
  { name: "News", icon: <Newspaper size={20} />, path: "/admin/newsAdmin" },
  { name: "Contact Us", icon: <Contact size={20} />, path: "/admin/contactAdmin" },
  { name: "Cloud", icon: <CloudUpload size={20} />, path: "/admin/cloudUpload" },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  const primaryNavItems = tabs.filter(item => item.primary);
  const secondaryNavItems = tabs.filter(item => !item.primary);

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex z-50 h-screen">
        <div
          className={`bg-red-900 text-white transition-all duration-500 ease-in-out ${isOpen ? "w-64" : "w-16"
            } flex flex-col`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-white">
            <span className={`text-xl font-bold text-white ${!isOpen && "hidden"}`}>
              Admin Panel
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:text-white hover:scale-[105%] cursor-pointer"
            >
              {isOpen ? <PanelLeftCloseIcon /> : <Menu />}
            </button>
          </div>

          <nav className="mt-4 flex-1 space-y-1">
            {tabs.map((tab, idx) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={idx}
                  to={tab.path}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-red-950/60 transition ${isActive ? "bg-red-950/60 border-l-4 border-white" : ""
                    }`}
                >
                  <div className={`${isActive ? "text-white" : "text-white"}`}>
                    {tab.icon}
                  </div>
                  {isOpen && (
                    <span
                      className={`text-sm font-medium ${isActive ? "text-white" : "text-white"
                        }`}
                    >
                      {tab.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Visitor Counter at the bottom of the sidebar */}
          <div className={`p-4 border-t border-white ${!isOpen ? "hidden" : ""}`}>
            <AdminVisitorCounter />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Similar to Navbar component */}
      <div className="md:hidden">
        {/* Main Bottom Navigation */}
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-70
            ${theme === "light"
              ? "bg-red-900 border-t border-white"
              : "bg-white/10 border-t border-gray-300 dark:border-gray-700"
            }
            backdrop-blur-lg px-2 py-2 safe-area-pb
          `}
        >
          <div className="flex items-center justify-around">
            {primaryNavItems.map((item) => (
              <MobileNavItem
                key={item.path}
                href={item.path}
                icon={item.icon}
                label={item.name}
                currentPath={location.pathname}
              />
            ))}

            {/* More Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all
                ${isMobileMenuOpen
                  ? theme === "light"
                    ? "text-white bg-white/20"
                    : "text-amber-500 bg-amber-900/20"
                  : theme === "light"
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-gray-300 hover:text-amber-500 hover:bg-gray-800"
                }
              `}
            >
              {isMobileMenuOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
              <span className="text-xs mt-1 font-medium">More</span>
            </button>
          </div>
        </div>

        {/* Expandable More Menu */}
        <div
          className={`
            fixed bottom-16 left-0 right-0 z-60 transition-all duration-300 ease-in-out
            ${isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
            }
          `}
        >
          <div
            className={`
              mx-4 mb-2 rounded-2xl shadow-xl border
              ${theme === "light"
                ? "bg-red-900/95 border-white/20"
                : "bg-gray-900/95 border-gray-800"
              }
              backdrop-blur-lg
            `}
          >
            {/* Arrow indicator */}
            <div className="flex justify-center py-2">
              <ChevronUp
                size={16}
                className={theme === "light" ? "text-white/50" : "text-gray-400"}
              />
            </div>

            {/* Secondary navigation items */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-3 gap-3">
                {secondaryNavItems.map((item) => (
                  <ExpandedMenuItem
                    key={item.path}
                    href={item.path}
                    icon={item.icon}
                    label={item.name}
                    currentPath={location.pathname}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </>
  );
};

const MobileNavItem = ({
  href,
  icon,
  label,
  currentPath
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  currentPath: string
}) => {
  const { theme } = useTheme();
  const isActive = currentPath === href;

  return (
    <Link
      to={href}
      className={`
        flex flex-col items-center justify-center p-2 rounded-xl transition-all
        ${isActive
          ? theme === "light"
            ? "text-white bg-white/20"
            : "text-amber-500 bg-amber-900/20"
          : theme === "light"
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-gray-300 hover:text-amber-500 hover:bg-gray-800"
        }
      `}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </Link>
  );
};

const ExpandedMenuItem = ({
  href,
  icon,
  label,
  currentPath
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  currentPath: string
}) => {
  const { theme } = useTheme();
  const isActive = currentPath === href;

  return (
    <Link
      to={href}
      className={`
        flex flex-col items-center justify-center p-4 rounded-xl transition-all
        ${isActive
          ? theme === "light"
            ? "text-white bg-white/20"
            : "text-amber-500 bg-amber-900/20"
          : theme === "light"
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-gray-300 hover:text-amber-500 hover:bg-gray-800"
        }
      `}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-medium text-center leading-tight">{label}</span>
    </Link>
  );
};

export default AdminSidebar;