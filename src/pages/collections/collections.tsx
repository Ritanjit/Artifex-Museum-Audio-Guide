// src\pages\collections\collections.tsx
import CollectionsBanner from "@/components/collections/collectionsBanner";
import FloatingSearchBar from "@/components/searchbar";
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getCollections } from "@/actions/collections";

// Define the structure of a collection item
interface CollectionItem {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  imageUrl: string;
}

const Collections: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearchQuery = params.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
  const [searchError, setSearchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionsData, setCollectionsData] = useState<CollectionItem[]>([]);
  const [apiError, setApiError] = useState(false);
  const navigate = useNavigate();

  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await getCollections(); // Directly get the array
        setCollectionsData(data);
        setApiError(false);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError(true);
      setTimeout(() => setSearchError(false), 2000);
      return;
    }
    navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
  };

  // Group collections by category
  const groupedCollections = collectionsData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({
      src: item.imageUrl,
      name: item.name,
      id: item.id
    });
    return acc;
  }, {} as Record<string, Array<{ src: string; name: string; id: string }>>);

  // Convert grouped object to array format
  const collectionSections = Object.entries(groupedCollections).map(
    ([title, items]) => ({
      title,
      items
    })
  );

  // Filter collections based on search query
  // const filteredCollections = collectionSections
  //   .map((collection) => {
  //     const filteredItems = collection.items.filter((item) =>
  //       item.name.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //     return { ...collection, items: filteredItems };
  //   })
  //   .filter((collection) => collection.items.length > 0);
  

  // Filter collections based on search query
  const filteredCollections = collectionSections
    .map((collection) => {
      const filteredItems = collection.items.filter((item) => {
        const collectionItem = collectionsData.find(ci => ci.id === item.id);
        if (!collectionItem) return false;

        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collectionItem.keywords.some(kw =>
            kw.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          collectionItem.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      return { ...collection, items: filteredItems };
    })
    .filter((collection) => collection.items.length > 0);


  return (
    <div className="bg-stone-100 dark:bg-black min-h-screen text-red-900 dark:text-white pb-15">
      <CollectionsBanner />

      {/* <div className="mt-20">
        <FloatingSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          showPrompt={true}
        />
      </div> */}

        <FloatingSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          showPrompt={true}
          // Pass collections data to searchbar
          collectionsData={collectionsData}
        />

      {searchError && (
        <div className="flex justify-center mt-2">
          <div className="bg-red-500 text-white text-sm px-3 py-2 rounded shadow-md">
            Please enter a search query!
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="mt-20 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading collections...</p>
          </div>
        ) : apiError ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Failed to Load Collections</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please try again later.
            </p>
          </div>
        ) : filteredCollections.length > 0 ? (
          filteredCollections.map((section) => {
            const isExpanded = showAll[section.title] || false;
            const displayedItems = isExpanded
              ? section.items
              : section.items.slice(0, 5);

            // Reset showAll state when search changes
            // useEffect(() => {
            //   setShowAll({});
            // }, [searchQuery]);

            return (
              <section key={section.title} className="mt-25 fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">{section.title}</h2>
                  {section.items.length > 4 && (
                    <button
                      onClick={() =>
                        setShowAll((prev) => ({
                          ...prev,
                          [section.title]: !isExpanded,
                        }))
                      }
                      className="text-lg font-bold text-red-900 hover:text-amber-500 dark:text-gray-300
                      dark:hover:text-white underline cursor-pointer"
                    >
                      {isExpanded ? "Show Less" : "Show All"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                  {displayedItems.map((item) => (
                    <div
                      key={item.name}
                      onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        // Slight delay to allow smooth scroll before navigating
                        setTimeout(() => {
                          navigate(`/audioplayer`);
                          // navigate(`/audioplayer/${item.id}`);
                        }, 300);
                      }}
                      className="block cursor-pointer"
                    >
                      <div className="relative group rounded-2xl overflow-hidden w-full h-[280px] sm:h-[300px]
                      md:h-[340px] shadow-md hover:shadow-lg transition duration-500">
                        {item.src ? (
                          <img
                            src={item.src}
                            alt={item.name}
                            className="rounded-xl object-cover w-full h-full transition-all duration-500 ease-in-out
                            transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="bg-gray-200 dark:bg-zinc-800 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                        <div
                          className="absolute z-10 bottom-3 left-0 mx-2 p-2 bg-red-900 dark:bg-white/60
                          backdrop-blur-lg w-[calc(100%-16px)] border border-white dark:border-black
                          rounded-lg shadow-sm shadow-transparent transition-all duration-500
                          group-hover:shadow-indigo-200 dark:group-hover:bg-amber-500"
                        >
                          <h6 className="font-semibold text-sm leading-6 text-white group-hover:text-amber-500
                          dark:text-black text-center">
                            {item.name}
                          </h6>
                          <p className="text-xs leading-5 text-gray-200 dark:text-gray-800 text-center
                          group-hover:text-amber-500/80">
                            {section.title} Collection
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No Collections Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? `No results for "${searchQuery}". Try another search term.`
                : "The collection is currently empty."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;



// // src\pages\collections\collections.tsx
// import CollectionsBanner from "@/components/collections/collectionsBanner";
// import FloatingSearchBar from "@/components/searchbar";
// import React, { useState } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";

// const collectionsData = [
//   {
//     title: "Satras",
//     items: [
//       { src: "src/assets/1_Auniati Satra.jpg", name: "Auniati Satra" },
//       { src: "src/assets/kamalabari.jpg", name: "Kamalabari Satra" },
//       { src: "src/assets/dakhinpat.jpg", name: "Dakhinpat Satra" },
//       { src: "src/assets/garmur.jpg", name: "Garhmur Satra" },
//       { src: "src/assets/benganati.jpg", name: "Bengenaati Satra" },
//       { src: "src/assets/satra1.jpg", name: "Satra one" },
//       { src: "src/assets/satra2.jpg", name: "Satra two" },
//       { src: "src/assets/satra3.webp", name: "Satra three" },
//       { src: "src/assets/satra4.jpg", name: "Satra four" },
//       { src: "src/assets/satra5.jpg", name: "Satra five" },
//     ],
//   },
//   {
//     title: "Mukhas",
//     items: [
//       { src: "src/assets/ravana.jpg", name: "Ravana Mukha" },
//       { src: "src/assets/hanuman.jpg", name: "Hanuman Mukha" },
//       { src: "src/assets/ok.jpg", name: "Narasimha Mukha" },
//       { src: "src/assets/garuda.jpg", name: "Garuda Mukha" },
//       { src: "src/assets/hiran.jpg", name: "Hiranyakashipu Mukha" },
//       { src: "src/assets/mukha1.jpg", name: "Mukha one" },
//       { src: "src/assets/mukha2.jpg", name: "Mukha two" },
//       { src: "src/assets/mukha3.jpg", name: "Mukha three" },
//       { src: "src/assets/mukha4.jpg", name: "Mukha four" },
//       { src: "src/assets/mukha5.jpg", name: "Mukha five" },
//     ],
//   },
// ];

// const Collections: React.FC = () => {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const initialSearchQuery = params.get("search") || "";

//   const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
//   const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
//   const [error, setError] = useState(false);
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     if (!searchQuery.trim()) {
//       setError(true);
//       setTimeout(() => setError(false), 2000);
//       return;
//     }
//     navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
//   };

//   const filteredCollections = collectionsData
//     .map((collection) => {
//       const filteredItems = collection.items.filter((item) =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       return { ...collection, items: filteredItems };
//     })
//     .filter((collection) => collection.items.length > 0);

//   return (
//     <div className="bg-stone-100 dark:bg-black min-h-screen text-red-900 dark:text-white pb-15">

//       <CollectionsBanner />

//       <div className="mt-20">
//         <FloatingSearchBar
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           handleSearch={handleSearch}
//           showPrompt={true}
//         />
//       </div>


//       {error && (
//         <div className="flex justify-center mt-2">
//           <div className="bg-red-500 text-white text-sm px-3 py-2 rounded shadow-md">
//             Please enter a search query!
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {filteredCollections.length > 0 ? (
//           filteredCollections.map((section) => {
//             const isExpanded = showAll[section.title] || false;
//             const displayedItems = isExpanded ? section.items : section.items.slice(0, 5);

//             return (
//               <section key={section.title} className="mt-25 fade-in">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-3xl font-bold">{section.title}</h2>
//                   {section.items.length > 4 && (
//                     <button
//                       onClick={() =>
//                         setShowAll((prev) => ({
//                           ...prev,
//                           [section.title]: !isExpanded,
//                         }))
//                       }
//                       className="text-lg font-bold text-red-900 hover:text-amber-500 dark:text-gray-300
//                       dark:hover:text-white underline"
//                     >
//                       {isExpanded ? "Show Less" : "Show All"}
//                     </button>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
//                   {displayedItems.map((item) => (
//                     <Link to="/audioplayer" key={item.name} className="block">
//                       <div className="relative group rounded-2xl overflow-hidden w-full h-[280px] sm:h-[300px]
//                       md:h-[340px] shadow-md hover:shadow-lg transition duration-500">
//                         <img
//                           src={item.src}
//                           alt={item.name}
//                           className="rounded-xl object-cover w-full h-full transition-all duration-500 ease-in-out
//                           transform group-hover:scale-105"
//                         />
//                         <div
//                           className="absolute z-10 bottom-3 left-0 mx-2 p-2 bg-red-900 dark:bg-white/60
//                           backdrop-blur-lg w-[calc(100%-16px)] border border-white dark:border-black
//                           rounded-lg shadow-sm shadow-transparent transition-all duration-500
//                           group-hover:shadow-indigo-200 dark:group-hover:bg-amber-500"
//                         >
//                           <h6 className="font-semibold text-sm leading-6 text-white group-hover:text-amber-500
//                           dark:text-black text-center">
//                             {item.name}
//                           </h6>
//                           <p className="text-xs leading-5 text-gray-200 dark:text-gray-800 text-center
//                           group-hover:text-amber-500/80">
//                             Satra Collections
//                           </p>
//                         </div>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </section>
//             );
//           })
//         ) : (
//           <p className="text-center text-gray-400 mt-10">No Collections found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Collections;


