import { useState } from "react";
import { useTheme } from "@/components/theme-provider/theme-provider";
import FloatingSearchBar from "@/components/searchbar";
import vid from "@/assets/majuli1.mp4";
import samoguriBg from "../../assets/samoguribg2.jpg";


const CollectionsBanner = () => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="relative z-30 min-h-[320px] overflow-visible flex flex-col 
        items-center justify-center px-4 sm:px-6 mb-10">
            {theme === "light" && (
                <div className="absolute inset-0 h-[320px] bg-cover bg-top opacity-100"
                    style={{ backgroundImage: `url(${samoguriBg})` }}
                >
                    {/* <video
                        src={vid}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    /> */}
                </div>
            )}

            <div className="relative z-10 text-white text-center w-full max-w-[1200px] px-2 sm:px-4 mt-20 
            backdrop-blur-md bg-white/10 border border-white/30 shadow-md p-4 rounded-xl">
                <h1
                    className="text-4xl sm:text-5xl font-bold [text-shadow:_0_5px_5px_rgb(0_0_0_/_90)] font-serif"
                >
                    Collections
                </h1>
                <p
                    className="text-xl sm:text-2xl font-bold font-sans mt-5 [text-shadow:_0_5px_5px_rgb(0_0_0_/_70)]"
                >
                    Explore Assam’s Satras, Mukhas and more.
                </p>
            </div>
        </div>
    );
};

export default CollectionsBanner;
