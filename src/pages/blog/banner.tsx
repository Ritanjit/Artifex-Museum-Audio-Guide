import { useState } from "react";
import { useTheme } from "@/components/theme-provider/theme-provider";
import banner from "../../assets/Mukkhas-Banner.jpg";

const Banner = () => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div
            className="relative z-30 min-h-[220px] sm:min-h-[320px] overflow-visible flex flex-col 
            items-center justify-center px-4 sm:px-6 mb-10"
        >
            {/* Background Image for Light and Dark Modes */}
            <div
                className={`absolute inset-0 w-full bg-cover bg-center ${theme === "light" ? "opacity-100" : "opacity-50"
                    }`}
                style={{
                    backgroundImage: `url(${banner})`,
                    height: "100%", // Will respect min-h-[320px] or responsive sm:min-h
                }}
            ></div>

            {/* Content */}
            <div className="relative z-10 text-red-900 dark:text-white text-center w-full 
            max-w-[500px] px-2 sm:px-4 mt-35 mb-10">
                <h1
                    className="text-3xl sm:text-5xl font-bold font-serif leading-tight"
                >
                    Mukhas of Majuli
                </h1>
                <p
                    className="text-base sm:text-2xl font-bold font-sans mt-4 sm:mt-5"
                >
                    A Gift of Mahapurush Srimanta Sankardev to Assam
                </p>
            </div>
        </div>
    );
};

export default Banner;
