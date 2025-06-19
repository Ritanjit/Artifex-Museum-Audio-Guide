import React, { useEffect, useState } from "react";
import { ModeToggle } from "@/components/theme-provider/mode-toggle";
import horaiLogo from "../../assets/horaiLogo.png";
import blankLogo from "../../assets/blank.png";
import { Button } from "../ui/button";
import {
  Home, Compass, Layers, Calendar, Info, ScanQrCode, Handshake, Menu,
  X,
  User,
  ChevronUp,
  MoreHorizontal
} from "lucide-react"; // Icons for bottom navbar
import { useNavigate } from "react-router";
import { useTheme } from "@/components/theme-provider/theme-provider"
import { useLocation } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const { theme, setTheme } = useTheme()

  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

    useEffect(() => {
      let lastScrollY = window.scrollY;

      const updateScrollDirection = () => {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? "down" : "up";
        if (direction !== scrollDirection && Math.abs(currentScrollY - lastScrollY) > 10) {
          setScrollDirection(direction);
        }
        lastScrollY = currentScrollY;
      };

      window.addEventListener("scroll", updateScrollDirection);

      return () => {
        window.removeEventListener("scroll", updateScrollDirection);
      };
    }, [scrollDirection]);

    return scrollDirection;
  };

  const scrollDirection = useScrollDirection();

  const mobileNavItems = [
    { href: "/", label: "Home", icon: <Home size={20} />, primary: true },
    { href: "/collections", label: "Collections", icon: <Layers size={20} />, primary: true },
    { href: "/events", label: "Events", icon: <Calendar size={20} />, primary: true },
    { href: "/feedback", label: "Feedback", icon: <Handshake size={20} />, primary: true },
    { href: "/news", label: "News", icon: <Info size={20} /> },
    { href: "/visit", label: "Visit", icon: <Compass size={20} />, },
    { href: "/about", label: "About Us", icon: <User size={20} /> },
  ];

  const primaryNavItems = mobileNavItems.filter(item => item.primary);
  const secondaryNavItems = mobileNavItems.filter(item => !item.primary);

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="absolute sm:fixed z-50 top-8 left-1/2 transform -translate-x-1/2 
        w-[90vw] sm:w-[92%] max-w-7xl px-4 sm:px-6 py-3
        flex justify-between items-center rounded-full border-3 dark:border transition-colors
        bg-red-900 dark:bg-white/10 backdrop-blur-3xl"
      >

        {/* gamusa bg navbar */}
        {/* <nav
        className={`absolute sm:fixed z-50 top-8 left-1/2 transform -translate-x-1/2
    w-[80%] sm:w-[92%] max-w-7xl px-4 sm:px-6 py-3
    flex justify-between items-center rounded-4xl border-0 border-red-500 dark:border transition-colors
    bg-image dark:bg-white/10 backdrop-blur-3xl custom-bg-image`}
      > */}

        {/* Logo - Moves to Center for Small Screens, Left for Larger Screens */}
        <div className="flex items-center">
          <img src={blankLogo} alt="blankLogo" className="h-10 w-30 rounded-full" />
        </div>

        {/* Decorative Logo - Moves to Right for Small Screens */}
        <div className="absolute right-38 sm:right-270 bottom-0 z-50">
          <img src={horaiLogo} alt="Logo" className="h-20 sm:h-22 w-auto hover:cursor-pointer"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "instant" });
              }
            }}
          />
        </div>

        {/* Desktop Navigation (Visible only on larger screens) */}
        <ul className="hidden md:flex space-x-4">
          <NavLink href="/" label="HOME" />
          {/* <NavLink href="/player" label="PLAYER" /> */}
          <NavLink href="/collections" label="COLLECTIONS" />
          <NavLink href="/events" label="EVENTS" />
          <NavLink href="/news" label="NEWS" />
          <NavLink href="/visit" label="VISIT" />
          <NavLink href="/feedback" label="FEEDBACK" />
          <NavLink href="/about" label="ABOUT US" />
        </ul>

        {/* Right Side - Login & Theme Toggle */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/auth")} // Navigate to the Auth page
            variant={theme === "light" ? "secondary" : "ghost"}
            className="rounded-full transition-all !text-white text-s inset-border-2xl bg-white/10
        dark:bg-secondary backdrop-blur-3xl hover:!text-amber-500 dark:hover:bg-secondary/90
        h-9 w-18 hover:h-10 hover:w-19"
          >
            Login
          </Button>
          <ModeToggle />
        </div>
      </nav>


      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
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
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
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
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
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

const NavLink = ({ href, label }: { href: string; label: string }) => {

  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <li
      className={`relative group font-semibold font-sans transition-all 
      ${isActive ? "text-amber-500 text-lg" : "text-white hover:text-amber-500 hover:text-lg"}`}
    >
      <a href={href} className="px-3 py-2">{label}</a>
      <span className={`absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] 
      flex items-center gap-1 transition-opacity duration-300 
      ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"   // add group-hover:opacity-100 to show underline on hover
        }`}>
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
        <span className="w-6 h-1 bg-amber-500 rounded"></span>
      </span>
    </li>
  );
};

const MobileNavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const isActive = location.pathname === href;

  return (
    <a
      href={href}
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
    </a>
  );
};

const ExpandedMenuItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const isActive = location.pathname === href;

  return (
    <a
      href={href}
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
    </a>
  );
};


export default Navbar;