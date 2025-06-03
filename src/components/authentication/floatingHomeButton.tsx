import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const FloatingHomeButton = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed top-6 left-6 z-50 group">
            {/* Floating Button */}
            <Button
                onClick={() => navigate("/")}
                className="w-12 h-12 flex items-center justify-center rounded-full
                bg-red-900 hover:bg-red-800 dark:bg-gray-800 dark:hover:bg-gray-700
                border-2 border-white dark:border-amber-500 text-white dark:text-amber-500
                transition-all shadow-lg relative cursor-pointer"
            >
                <ArrowLeft className="w-6 h-6" />
            </Button>

            {/* Tooltip */}
            <div
                className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1 
        rounded-md bg-red-800 text-white text-xs whitespace-nowrap opacity-0
        group-hover:opacity-100 transition-opacity duration-300"
            >
                Back to Home
            </div>
        </div>
    );
};

export default FloatingHomeButton;
