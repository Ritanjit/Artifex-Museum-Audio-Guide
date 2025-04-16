import React from "react";
import { Link, useNavigate } from "react-router-dom";

const collectionsData = [
  {
    title: "EXPLORE OUR COLLECTIONS",
    items: [
      { src: "src/assets/ravana.jpg", name: "Ravana Mukha" },
      { src: "src/assets/hanuman.jpg", name: "Hanuman Mukha" },
      { src: "src/assets/ok.jpg", name: "Narasimha Mukha" },
      { src: "src/assets/garuda.jpg", name: "Garuda Mukha" },
      { src: "src/assets/hiran.jpg", name: "Hiranyakashipu Mukha" },
    ],
  },
];

const HomeCollections: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 bg-stone-100 text-red-900 dark:bg-black dark:text-white py-10 px-6 sm:px-16 lg:px-24">
      {collectionsData.map((section) => (
        <div key={section.title} className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-5xl font-bold">{section.title}</h2>
            <button
              onClick={() => {
                navigate("/collections");
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
              className="text-lg mt-8 font-bold text-red-900 hover:text-amber-500 
              dark:text-gray-300 dark:hover:text-white underline"
            >
              Show All
            </button>
          </div>

          {/* Updated grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {section.items.map((item) => (
              <Link to="/audioplayer" key={item.name} className="block">
                <div className="relative group rounded-2xl overflow-hidden w-full h-[280px] sm:h-[300px] md:h-[340px] shadow-md 
                hover:shadow-lg transition duration-500">

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
                    <p className="text-xs leading-5 text-gray-200 dark:text-gray-800 text-center group-hover:text-amber-500/80">
                      Satra Collections
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeCollections;
