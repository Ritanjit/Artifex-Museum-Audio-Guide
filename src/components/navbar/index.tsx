import React, { useState } from "react";
import { ModeToggle } from "@/components/theme-provider/mode-toggle";
import horaiLogo from "../../assets/horaiLogo.png";
import blankLogo from "../../assets/blank.png";
import { Button } from "../ui/button";
import { Home, Compass, Layers, Calendar, Info, ScanQrCode } from "lucide-react"; // Icons for bottom navbar
import { useNavigate } from "react-router";
import { useTheme } from "@/components/theme-provider/theme-provider"
import { useLocation } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const { theme, setTheme } = useTheme()

  const location = useLocation();

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="absolute sm:fixed z-50 top-8 left-1/2 transform -translate-x-1/2 
        w-[80%] sm:w-[92%] max-w-7xl px-4 sm:px-6 py-3
        flex justify-between items-center rounded-full border-3 dark:border transition-colors
        bg-red-900 dark:bg-white/10 backdrop-blur-3xl"
      >

      {/* bg navbar */}
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


      {/* Bottom Navbar (Mobile Only) */}
      <div
        className={`
          fixed z-50 bottom-0 left-0 w-full
          ${theme === "light" ?
            "bg-red-900 border-t-1 border-white" :
            "bg-white/10 border-t border-gray-300 dark:border-gray-700"}
          backdrop-blur-lg md:hidden flex justify-around py-3
        `}
      >
        <NavItem href="/" icon={<Home size={24} />} label="Home" />
        <NavItem href="/visit" icon={<Compass size={24} />} label="Visit" />
        <NavItem href="/collections" icon={<Layers size={24} />} label="Collections" />
        <NavItem href="/events" icon={<Calendar size={24} />} label="Event" />
        <NavItem href="/about" icon={<Info size={24} />} label="About Us" />
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

const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <a
      href={href}
      className={`flex flex-col items-center transition-all ${
        isActive
          ? "text-amber-500 font-bold"
          : "text-white hover:text-amber-500"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </a>
  );
};


export default Navbar;
