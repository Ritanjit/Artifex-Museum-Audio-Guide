import FloatingSearchBar from "@/components/searchbar";
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const collectionsData = [
  {
    title: "Satras",
    items: [
      { src: "src/assets/1_Auniati Satra.jpg", name: "Auniati Satra" },
      { src: "src/assets/kamalabari.jpg", name: "Kamalabari Satra" },
      { src: "src/assets/dakhinpat.jpg", name: "Dakhinpat Satra" },
      { src: "src/assets/garmur.jpg", name: "Garhmur Satra" },
      { src: "src/assets/benganati.jpg", name: "Bengenaati Satra" },
      { src: "src/assets/satra1.jpg", name: "Satra one" },
      { src: "src/assets/satra2.jpg", name: "Satra two" },
      { src: "src/assets/satra3.webp", name: "Satra three" },
      { src: "src/assets/satra4.jpg", name: "Satra four" },
      { src: "src/assets/satra5.jpg", name: "Satra five" },
    ],
  },
  {
    title: "Mukhas",
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

const Collections: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearchQuery = params.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
  };

  // Filter collections based on search query
  const filteredCollections = collectionsData
    .map((collection) => {
      const filteredItems = collection.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...collection,
        items: filteredItems,
      };
    })
    .filter((collection) => collection.items.length > 0);

  return (
    <div className="bg-black min-h-screen text-white items-center pb-15 pt-25">
      {/* Search Bar */}
      <FloatingSearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Error Message Tooltip */}
      {error && (
        <div className="flex justify-center mt-2">
          <div className="bg-red-500 text-white text-sm px-3 py-2 rounded shadow-md">
            Please enter a search query!
          </div>
        </div>
      )}

      {/* Collections Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((section) => {
            const isExpanded = showAll[section.title] || false;
            const displayedItems = isExpanded ? section.items : section.items.slice(0, 4);

            return (
              <section key={section.title} className="mt-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold">{section.title}</h2>
                  {section.items.length > 4 && (
                    <span
                      className="text-gray-400 cursor-pointer text-sm hover:text-white transition"
                      onClick={() =>
                        setShowAll((prev) => ({ ...prev, [section.title]: !isExpanded }))
                      }
                    >
                      {isExpanded ? "Show less" : "Show all"}
                    </span>
                  )}
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {displayedItems.map((item) => (
                    <Link to="/audioplayer" key={item.name} className="block">
                      <div className="relative group rounded-3xl overflow-hidden w-full h-[250px] sm:h-[300px] md:h-[350px] shadow-md 
                      hover:shadow-lg transition duration-500">
                        
                        {/* Image with Zoom Effect */}
                        <img
                          src={item.src}
                          alt={item.name}
                          className="rounded-2xl object-cover w-full h-full transition-all 
                          duration-500 ease-in-out transform group-hover:scale-110"
                        />

                        {/* Text Overlay */}
                        <div className="absolute z-10 bottom-3 left-0 mx-3 p-3 bg-white/60 backdrop-blur-lg w-[calc(100%-24px)] 
                          rounded-xl shadow-sm shadow-transparent transition-all duration-500 
                          group-hover:shadow-indigo-200 group-hover:bg-amber-500">
                          <h6 className="font-semibold text-base leading-7 text-black text-center">
                            {item.name}
                          </h6>
                          <p className="text-xs leading-5 text-gray-800 text-center">Mukha Collections</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <p className="text-center text-gray-400 mt-10">No Collections found.</p>
        )}
      </div>
    </div>
  );
};

export default Collections;
