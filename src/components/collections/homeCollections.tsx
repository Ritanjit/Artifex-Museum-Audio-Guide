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


import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./homeCollections.css";

const collectionsData = [
  {
    title: "EXPLORE OUR COLLECTIONS",
    items: [
      { src: "src/assets/ravana.jpg", name: "Ravana Mukha" },
      { src: "src/assets/hanuman.jpg", name: "Hanuman Mukha" },
      { src: "src/assets/ok.jpg", name: "Narasimha Mukha" },
      { src: "src/assets/garuda.jpg", name: "Garuda Mukha" },
      { src: "src/assets/hiran.jpg", name: "Hiranyakashipu Mukha" },
      { src: "src/assets/mukha1.jpg", name: "Mukha one" },
      { src: "src/assets/mukha2.jpg", name: "Mukha two" },
      { src: "src/assets/mukha3.jpg", name: "Mukha three" },
      { src: "src/assets/mukha4.jpg", name: "Mukha four" },
      { src: "src/assets/mukha5.jpg", name: "Mukha five" },
    ],
  },
];

const HomeCollections: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current && scrollRef.current.firstChild instanceof HTMLElement) {
      const cardWidth = scrollRef.current.firstChild.offsetWidth + 200; // include gap
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Auto scroll every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && scrollRef.current.firstChild instanceof HTMLElement) {
        const cardWidth = scrollRef.current.firstChild.offsetWidth + 200;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (scrollLeft + cardWidth >= maxScrollLeft) {
          // Reset to start (simulate loop)
          scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="relative z-10 bg-white text-red-900 dark:bg-black 
  dark:text-white pt-20 pb-10 px-4 sm:px-6 lg:px-24">
      {collectionsData.map((section) => (
        <div key={section.title} className="mb-12">
          <div className="flex flex-row sm:flex-row sm:justify-between sm:items-center mb-6 gap-24 
          sm:gap-0 text-center sm:text-left">
            <h2 className="text-4xl sm:text-5xl font-bold">{section.title}</h2>
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

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="scroll-container overflow-x-auto no-scrollbar flex gap-4 snap-x snap-mandatory"
          >
            {[...section.items, ...section.items, ...section.items, ...section.items,
            ...section.items, ...section.items, ...section.items, ...section.items,
            ...section.items, ...section.items, ...section.items, ...section.items].map((item, index) => (
              <Link
                to="/audioplayer"
                key={`${item.name}-${index}`}
                className="min-w-[220px] sm:min-w-[240px] md:min-w-[260px] snap-start"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                <div className="relative group rounded-2xl overflow-hidden h-[280px] sm:h-[300px] md:h-[340px] shadow-md 
                hover:shadow-lg transition duration-500 w-full fade-in">

                  <img
                    src={item.src}
                    alt={item.name}
                    className="rounded-xl object-cover w-full h-full transition-all 
                    duration-500 ease-in-out transform group-hover:scale-105"
                  />

                  <div className="absolute z-10 bottom-3 left-0 mx-2 p-2 bg-red-900 dark:bg-white/60 
                    backdrop-blur-lg w-[calc(100%-16px)] border border:white dark:border-black
                    rounded-lg shadow-sm shadow-transparent transition-all duration-500
                    group-hover:shadow-indigo-200 dark:group-hover:bg-amber-500">
                    <h6 className="font-semibold text-sm leading-6 text-white group-hover:text-amber-500
                    dark:text-black text-center">
                      {item.name}
                    </h6>
                    <p className="text-xs leading-5 text-gray-200 dark:text-gray-800 text-center 
                    group-hover:text-amber-500/80">
                      Satra Collections
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="slider-nav mt-4 flex justify-end gap-2 sm:gap-4 px-35 sm:px-1">
            <button className="nav-btn left pb-1" onClick={() => scroll("left")}>
              ⇽
            </button>
            <button className="nav-btn right pb-1" onClick={() => scroll("right")}>
              ⇾
            </button>
          </div>


        </div>
      ))}
    </div>
  );
};

export default HomeCollections;

