import { useState } from "react";
import { useTheme } from "@/components/theme-provider/theme-provider";
import FloatingSearchBar from "@/components/searchbar";
import vid from "@/assets/majuli1.mp4";
import banner from "../../assets/Mukkhas-Banner.jpg";
import maskBg from "../../assets/maskBg.jpg";


const Banner = () => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="relative z-30 min-h-[320px] overflow-visible flex flex-col 
        items-center justify-center px-4 sm:px-6 mb-10">
            {theme === "light" && (
                <div className="absolute inset-0 h-[320px] bg-cover bg-center opacity-100"
                    style={{ backgroundImage: `url(${banner})` }}
                ></div>
            )}

            {theme === "dark" && (
                <div className="absolute inset-0 h-[320px] bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${banner})` }}
                ></div>
            )}

            <div className="relative z-10 text-red-900 dark:text-white text-center w-full max-w-[500px] px-2 sm:px-4 mt-15">
                <h1
                    className="text-4xl sm:text-5xl font-bold font-serif mt-10"
                >
                    Mukhas of Majuli
                </h1>
                <p
                    className="text-xl sm:text-2xl font-bold font-sans mt-5"
                >
                    A Gift of Mahapurush Srimanta Sankardev to Assam
                </p>
            </div>
        </div>
    );
};

export default Banner;
