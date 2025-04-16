import { useState, useEffect } from "react";
import { Search, ScanQrCode } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import QRScanner from "../qrScanner/QRScanner";

interface FloatingSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: () => void;
    showPrompt?: boolean;
}

// List of available search items from collections.tsx
const allItems = [
    "Auniati Satra", "Kamalabari Satra", "Dakhinpat Satra", "Garhmur Satra",
    "Bengenaati Satra", "Satra one", "Satra two", "Satra three", "Satra four",
    "Satra five", "Ravana Mukha", "Hanuman Mukha", "Narasimha Mukha", "Garuda Mukha",
    "Hiranyakashipu Mukha", "Mukha one", "Mukha two", "Mukha three", "Mukha four", "Mukha five"
];

const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({ searchQuery, setSearchQuery, handleSearch, showPrompt = false }) => {
    const [showScanner, setShowScanner] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/collections") {
            setFilteredSuggestions([]); // Hide suggestions on collections page
        }
    }, [location.pathname]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleRedirect();
        }
    };

    const handleRedirect = () => {
        if (searchQuery.trim()) {
            navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        setFilteredSuggestions([]);
        navigate(`/collections?search=${encodeURIComponent(suggestion)}`);
    };

    const handleInputChange = (value: string) => {
        setSearchQuery(value);
        if (value.trim()) {
            const suggestions = allItems
                .filter(item => item.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 10); // Keep maximum 10 suggestions available, but show 5 at a time
            setFilteredSuggestions(suggestions);
        } else {
            setFilteredSuggestions([]);
        }
    };

    return (
        <div className="relative flex flex-col items-center mt-6 px-4 w-full">
            {/* Search Bar Container */}
            <div className="relative flex items-center bg-red-900 dark:bg-white/10 backdrop-blur-lg shadow-md 
            shadow-black sm:border-1 sm:shadow-md rounded-full w-full sm:w-[90%] md:w-[80%] max-w-[700px] 
            h-[50px] sm:h-[50px] md:h-[60px] p-2 pl-4 pr-10 sm:pr-16 md:pr-20">

                {/* Search Icon */}
                <Search className="text-white sm:text-white h-5 w-5" />

                {/* Input Field */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for paintings, manuscripts & more..."
                    className="flex-1 bg-transparent text-white placeholder-white outline-none px-4 text-sm 
                    sm:text-base md:text-lg"
                />

                {/* QR Code Scanner Button (Only for larger screens) */}
                <button
                    onClick={() => setShowScanner(true)}
                    className="group hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-red-950/50
                    bg-transparent dark:hover:bg-amber-500 transition absolute right-3 sm:right-26"
                >
                    <ScanQrCode className="text-white h-6 w-6 transition-colors group-hover:text-amber-500 
                    dark:group-hover:text-black dark:group-hover:h-7 dark:group-hover:w-7" />
                </button>

                {/* Search Button (Only for larger screens) */}
                <button
                    onClick={handleRedirect}
                    className="hidden md:block absolute right-[12px] bg-white/10 text-white hover:text-amber-500 
                    px-5 py-2 rounded-full dark:hover:bg-amber-500  dark:hover:text-black hover:bg-red-950/50
                    hover:px-5.5 hover:py-2.5 transition text-base font-medium cursor-pointer"
                >
                    Search
                </button>
            </div>

            {/* Search Suggestions (Scrollable) */}
            {searchQuery.length > 0 && (
                <ul className="absolute top-[55px] sm:top-[60px] bg-stone-100 dark:bg-white/10 text-black 
                w-full max-w-[600px] rounded-lg shadow-lg mt-2 py-2 z-50 max-h-[200px] overflow-y-auto 
                backdrop-blur-3xl text-left">
                    {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 cursor-pointer hover:bg-red-900/90 hover:text-white
                                dark:hover:text-amber-500 dark:hover:bg-gray-950/30 
                                transition text-sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-sm text-black dark:text-white/70 bg-transparent cursor-default">
                            No collections found
                        </li>
                    )}
                </ul>
            )}


            {/* QR Scanner Popup */}
            {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}
        </div>
    );
};

export default FloatingSearchBar;
