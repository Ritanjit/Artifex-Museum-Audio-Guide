import React from "react";
import { Link, useNavigate } from "react-router-dom";

const collectionsData = [
  {
    title: "Satras",
    items: [
      { src: "src/assets/1_Auniati Satra.jpg", name: "Auniati Satra" },
      { src: "src/assets/kamalabari.jpg", name: "Kamalabari Satra" },
      { src: "src/assets/dakhinpat.jpg", name: "Dakhinpat Satra" },
      { src: "src/assets/garmur.jpg", name: "Garhmur Satra" },
    ],
  },
];

const HomeCollections: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white py-10 px-4 sm:px-10">
      {collectionsData.map((section) => (
        <div key={section.title} className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <button
              onClick={() => navigate("/collections")}
              className="text-sm text-gray-300 hover:text-white underline"
            >
              Show All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {section.items.map((item) => (
              <Link to="/audioplayer" key={item.name} className="block">
                <div className="relative group rounded-3xl overflow-hidden w-full h-[250px] sm:h-[300px] md:h-[350px] shadow-md 
                hover:shadow-lg transition duration-500">
                  
                  <img
                    src={item.src}
                    alt={item.name}
                    className="rounded-2xl object-cover w-full h-full transition-all 
                    duration-500 ease-in-out transform group-hover:scale-110"
                  />

                  <div className="absolute z-10 bottom-3 left-0 mx-3 p-3 bg-white/60 
                  backdrop-blur-lg w-[calc(100%-24px)] border-2 border-black
                    rounded-xl shadow-sm shadow-transparent transition-all duration-500 
                    group-hover:shadow-indigo-200 group-hover:bg-amber-500">
                    <h6 className="font-semibold text-base leading-7 text-black text-center">
                      {item.name}
                    </h6>
                    <p className="text-xs leading-5 text-gray-800 text-center">Satra Collections</p>
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
