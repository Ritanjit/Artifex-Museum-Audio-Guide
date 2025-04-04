import { useState } from "react";
import LatestNewsBulletin from "../bulletin/bulletin";
import { BackgroundPattern } from "./background-pattern";
import FloatingSearchBar from "@/components/searchbar";

const Hero06 = () => {

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
    <div className="min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6">
      <BackgroundPattern />

      {/* Content Container */}
      <div className="relative z-10 text-zinc-100 text-center w-full max-w-[1200px] px-2 sm:px-4 mt-20 sm:mt-28 lg:mt-40">

        {/* Title (for large screens) */}
        <h1
          className="hidden sm:block sm:text-2xl md:text-4xl lg:text-5xl font-bold  
          [text-shadow:_0_8px_8px_rgb(0_0_0_/_10)] font-serif"
        >
          Artifex - Echoes of Heritage, Voices of Art.
        </h1>

        {/* Title (for smaller screens) */}
        <h1
          className="text-4xl sm:hidden sm:text-2xl md:text-4xl lg:text-5xl font-bold  
          [text-shadow:_0_8px_8px_rgb(0_0_0_/_10)] font-serif"
        >
          Artifex
        </h1>
        <p className="text-xl sm:hidden sm:text-2xl md:text-4xl lg:text-5xl font-bold  
          [text-shadow:_0_8px_8px_rgb(0_0_0_/_10)] font-sans mt-5">
            Echoes of Heritage, Voices of Art.
        </p>

        {/* Search Bar */}
        <FloatingSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={() => {}} showPrompt={true} />
      </div>
    </div>
    </>
  );
};

export default Hero06;



// FOR VIDEO BANNER ---------->

// import heroImage from "../../assets/herobg.jpg"; // Adjust the path as needed
// import heroVideo from "../../assets/majuli.mp4";
// import satraImage from "../../assets/satra.jpg";
// import bg from "../../assets/bg.jpg";

// import { BackgroundPattern } from "./background-pattern";
// import FloatingSearchBar from "@/components/searchbar";

// const Hero06 = () => {
//   return (
//     <>
//       <div className="min-h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6">
//         <BackgroundPattern />

//         {/* Outer Container for Absolute Centering */}
//         <div className="relative z-10 flex flex-col items-center w-full">
//           {/* Banner Container */}
//           <div
//             className="relative w-[90%] min-w-[320px] sm:min-w-[600px] md:min-w-[900px] 
//             max-w-[1200px] h-auto max-h-[500px] rounded-4xl overflow-hidden mx-auto 
//             mt-20 sm:mt-28 lg:mt-40 flex items-center justify-center"
//           >
//             {/* Background Image */}
//             {/* <div
//               className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
//               style={{ backgroundImage: `url(${satraImage})` }}
//             ></div> */}

//             {/* Background Video */}
//             {/* <div className="absolute inset-0 flex justify-center items-center">
//               <video
//                 src={heroVideo}
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 className="w-full h-full object-cover"
//               />
//             </div> */}

//             {/* Content */}
//             <div className="relative z-10 text-zinc-100 text-center px-2 sm:px-4">
//               <h1
//                 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold  
//                 [text-shadow:_0_8px_8px_rgb(0_0_0_/_10)] font-serif"
//               >
//                 Artifex - Echoes of Heritage, Voices of Art.
//               </h1>
//               <FloatingSearchBar />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Hero06;
