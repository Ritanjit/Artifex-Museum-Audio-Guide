import React, { useState } from "react";
import { ModeToggle } from "@/components/theme-provider/mode-toggle";
import logo1 from "../../assets/logo-light.png";
import samaguriLogo from "../../assets/sl1.png";
import samaguriLogo1 from "../../assets/sl2.png";
import horaiLogo from "../../assets/horaiLogo.png";
import blankLogo from "../../assets/blank.png";
import { Button } from "../ui/button";
import { Home, Compass, Layers, Calendar, Info, ScanQrCode } from "lucide-react"; // Icons for bottom navbar
import QRScanner from "../qrScanner/QRScanner";
import { useNavigate } from "react-router";

const Navbar = () => {

  const navigate = useNavigate();

  const [showScanner, setShowScanner] = useState(false); // State to control QRScanner visibility

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="fixed z-50 top-8 left-1/2 transform -translate-x-1/2 
        w-[80%] sm:w-[92%] max-w-7xl px-4 sm:px-6 py-3
        flex justify-between items-center rounded-full border transition-colors
        bg-white/10 backdrop-blur-3xl text-black dark:text-white"
      >
        
        {/* Logo - Moves to Center for Small Screens, Left for Larger Screens */}
        <div className="flex items-center">
          <img src={blankLogo} alt="blankLogo" className="h-10 w-30 rounded-full" />
        </div>

        {/* Decorative Logo - Moves to Right for Small Screens */}
        <div className="absolute right-38 sm:right-270 bottom-0 z-50">
          <img src={horaiLogo} alt="Logo" className="h-20 sm:h-22 w-auto" />
        </div>

        {/* Desktop Navigation (Visible only on larger screens) */}
        <ul className="hidden md:flex space-x-4">
          <NavLink href="/" label="HOME" />
          {/* <NavLink href="/player" label="PLAYER" /> */}
          <NavLink href="/collections" label="COLLECTIONS" />
          <NavLink href="/events" label="EVENTS" />
          <NavLink href="/visit" label="VISIT" />
          <NavLink href="/about" label="ABOUT US" />
        </ul>

        {/* Right Side - Login & Theme Toggle */}
        <div className="flex items-center space-x-4">
      <Button
        onClick={() => navigate("/auth")} // Navigate to the Auth page
        className="rounded-full transition-all bg-secondary text-black text-s inset-border-2xl
        hover:bg-gray-300 dark:bg-secondary backdrop-blur-3xl dark:text-amber-500 dark:hover:bg-secondary/90
        hover:h-10 hover:w-18"
      >
        Login
      </Button>
      <ModeToggle />
    </div>
      </nav>
        

      {/* Bottom Navbar (Mobile Only) */}
      <div className="fixed z-50 bottom-0 left-0 w-full bg-white/10 backdrop-blur-lg 
        text-amber-500 dark:text-white border-t border-gray-300 dark:border-gray-700 
        md:hidden flex justify-around py-3">
        <NavItem href="/" icon={<Home size={24} className="text-amber-500" />} label="Home" />
        <NavItem href="/visit" icon={<Compass size={24} className="text-amber-500" />} label="Visit" />
        <NavItem href="/collections" icon={<Layers size={24} className="text-amber-500" />} label="Collections" />
        <NavItem href="/events" icon={<Calendar size={24} className="text-amber-500" />} label="Event" />
        <NavItem href="/about" icon={<Info size={24} className="text-amber-500" />} label="About Us" />
      </div>


    </>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <li className="relative group text-white font-semibold font-sans
    hover:text-amber-500 hover:text-lg transition-all">
      <a href={href} className="px-3 py-2">{label}</a>
      {/* Hover effect with dot and underline */}
      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] flex items-center 
      gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
        <span className="w-6 h-1 bg-amber-500 rounded"></span>
      </span>
    </li>
  );
};

const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <a href={href} className="flex flex-col items-center text-gray-500 
    hover:text-yellow-400 transition">
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </a>
  );
};

export default Navbar;
