import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCollections } from "@/actions/collections";
import "./homeCollections.css";
import { getAllArtifacts } from "@/actions/artifact";

interface CollectionItem {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  imageUrl: string;
}

const HomeCollections: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await getAllArtifacts();
        // Filter to only show Satras category with at least 5 items
        const satrasCollections = data.filter(item =>
          item.category === "Satras" && item.imageUrl
        ).slice(0, 10); // Limit to 10 items for carousel

        setCollections(satrasCollections);
        setError(false);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current && scrollRef.current.firstChild instanceof HTMLElement) {
      const cardWidth = scrollRef.current.firstChild.offsetWidth + 16; // include gap
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Auto scroll every 3 seconds
  useEffect(() => {
    if (collections.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current && scrollRef.current.firstChild instanceof HTMLElement) {
        const cardWidth = scrollRef.current.firstChild.offsetWidth + 16;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (scrollLeft + cardWidth >= maxScrollLeft) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [collections]);

  if (isLoading) {
    return (
      <div className="relative z-10 w-full overflow-hidden bg-white text-red-900 dark:bg-black dark:text-white pt-20 pb-10 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold">EXPLORE OUR COLLECTIONS</h2>
          <div className="text-sm sm:text-lg pr-2 sm:pr-0 mt-6 sm:mt-8 font-bold text-gray-400">
            Loading...
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-10 bg-white text-red-900 dark:bg-black dark:text-white pt-20 pb-10 px-4 sm:px-6 lg:px-24">
        <div className="flex flex-row sm:flex-row sm:justify-between sm:items-center mb-6 gap-24 sm:gap-0 text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl font-bold">EXPLORE OUR COLLECTIONS</h2>
        </div>
        <div className="text-center py-10">
          <p className="text-red-600 dark:text-amber-500">Failed to load collections. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="relative z-10 bg-white text-red-900 dark:bg-black dark:text-white pt-20 pb-10 px-4 sm:px-6 lg:px-24">
        <div className="flex flex-row sm:flex-row sm:justify-between sm:items-center mb-6 gap-24 sm:gap-0 text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl font-bold">EXPLORE OUR COLLECTIONS</h2>
          <button
            onClick={() => {
              navigate("/collections");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className="text-sm sm:text-lg pr-2 sm:pr-0 mt-6 sm:mt-8 font-bold text-red-900 hover:text-amber-500 
            dark:text-gray-300 dark:hover:text-white underline cursor-pointer"
          >
            View More
          </button>
        </div>
        <div className="text-center py-10">
          <p>No collections available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 bg-white text-red-900 dark:bg-black dark:text-white pt-12 pb-8 px-4 sm:pt-20 sm:pb-10 sm:px-6 lg:px-24">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0 text-center sm:text-left">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold">EXPLORE OUR COLLECTIONS</h2>
        <button
          onClick={() => {
            navigate("/collections");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          className="text-xs sm:text-sm md:text-lg pr-0 sm:pr-2 mt-0 sm:mt-6 md:mt-8 font-bold text-red-900 hover:text-amber-500 
      dark:text-gray-300 dark:hover:text-white underline cursor-pointer"
        >
          View More
        </button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="scroll-container overflow-x-auto no-scrollbar flex gap-3 sm:gap-4 snap-x snap-mandatory"
      >
        {collections.map((item) => (
          <Link
            to={`/audioplayer`}
            key={item.id}
            className="min-w-[160px] sm:min-w-[220px] md:min-w-[240px] lg:min-w-[260px] snap-start flex-none" // Added flex-none
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            <div className="relative group rounded-xl sm:rounded-2xl overflow-hidden h-[200px] sm:h-[280px] md:h-[300px] lg:h-[340px] w-full aspect-[3/4] shadow-md 
          hover:shadow-lg transition duration-500 fade-in">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg sm:rounded-xl transition-all 
                duration-500 ease-in-out transform group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 border border-dashed rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-gray-500 text-xs sm:text-sm">No image</span>
                </div>
              )}

              <div className="absolute z-10 bottom-2 sm:bottom-3 left-0 mx-1 sm:mx-2 p-1 sm:p-2 bg-red-900 dark:bg-white/60 
              backdrop-blur-lg w-[calc(100%-8px)] sm:w-[calc(100%-16px)] border border-white dark:border-black
              rounded-md sm:rounded-lg shadow-sm shadow-transparent transition-all duration-500
              group-hover:shadow-indigo-200 dark:group-hover:bg-amber-500">
                <h6 className="font-semibold text-xs sm:text-sm leading-5 sm:leading-6 text-white group-hover:text-amber-500
              dark:text-black text-center">
                  {item.name}
                </h6>
                <p className="text-[10px] xs:text-xs leading-4 sm:leading-5 text-gray-200 dark:text-gray-800 text-center 
              group-hover:text-amber-500/80">
                  Satra Collections
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      {collections.length > 1 && (
        <div className="slider-nav mt-3 sm:mt-4 flex justify-end gap-1 sm:gap-2 md:gap-4 px-0 sm:px-1">
          <button
            className="nav-btn left pb-1 text-lg sm:text-xl hover:text-amber-500"
            onClick={() => scroll("left")}
          >
            ⇽
          </button>
          <button
            className="nav-btn right pb-1 text-lg sm:text-xl hover:text-amber-500"
            onClick={() => scroll("right")}
          >
            ⇾
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeCollections;


// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const collectionsData = [
//   {
//     title: "EXPLORE OUR COLLECTIONS",
//     items: [
//       { src: "src/assets/ravana.jpg", name: "Ravana Mukha" },
//       { src: "src/assets/hanuman.jpg", name: "Hanuman Mukha" },
//       { src: "src/assets/ok.jpg", name: "Narasimha Mukha" },
//       { src: "src/assets/garuda.jpg", name: "Garuda Mukha" },
//       { src: "src/assets/hiran.jpg", name: "Hiranyakashipu Mukha" },
//     ],
//   },
// ];

// const HomeCollections: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative z-10 bg-white text-red-900 dark:bg-black dark:text-white py-10 px-6 sm:px-16 lg:px-24 fade-in">
//       {collectionsData.map((section) => (
//         <div key={section.title} className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-5xl font-bold">{section.title}</h2>
//             <button
//               onClick={() => {
//                 navigate("/collections");
//                 window.scrollTo({ top: 0, behavior: "instant" });
//               }}
//               className="text-lg mt-8 font-bold text-red-900 hover:text-amber-500
//               dark:text-gray-300 dark:hover:text-white underline cursor-pointer"
//             >
//               Explore All
//             </button>
//           </div>

//           {/* Updated grid layout */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
//             {section.items.map((item) => (
//               <Link to="/audioplayer"
//                 key={item.name}
//                 className="block"
//                 onClick={() => {
//                   window.scrollTo({ top: 0, behavior: "instant" });
//                 }}>
//                 <div className="relative group rounded-2xl overflow-hidden w-full h-[280px] sm:h-[300px] md:h-[340px] shadow-md
//                 hover:shadow-lg transition duration-500">

//                   <img
//                     src={item.src}
//                     alt={item.name}
//                     className="rounded-xl object-cover w-full h-full transition-all
//                     duration-500 ease-in-out transform group-hover:scale-105"
//                   />

//                   <div className="absolute z-10 bottom-3 left-0 mx-2 p-2 bg-red-900 dark:bg-white/60
//                     backdrop-blur-lg w-[calc(100%-16px)] border border:white dark:border-black
//                     rounded-lg shadow-sm shadow-transparent transition-all duration-500
//                     group-hover:shadow-indigo-200 dark:group-hover:bg-amber-500">
//                     <h6 className="font-semibold text-sm leading-6 text-white group-hover:text-amber-500
//                     dark:text-black text-center">
//                       {item.name}
//                     </h6>
//                     <p className="text-xs leading-5 text-gray-200 dark:text-gray-800 text-center group-hover:text-amber-500/80">
//                       Satra Collections
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default HomeCollections;
