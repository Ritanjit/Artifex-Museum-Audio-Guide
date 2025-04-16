import { useState } from "react";
import { BackgroundPattern } from "./background-pattern";
import FloatingSearchBar from "@/components/searchbar";

const Hero06 = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="relative z-30 dark:min-h-screen min-h-[320px] overflow-visible transition-all duration-500
      flex flex-col items-center justify-center px-4 sm:px-6">
        <BackgroundPattern />

        <div className="relative z-10 text-zinc-100 dark:text-zinc-100 text-center w-full max-w-[1200px] 
        px-2 sm:px-4 mt-20 ">
          <h1
            className="hidden sm:block sm:text-2xl md:text-4xl lg:text-5xl font-bold
            [text-shadow:_0_5px_5px_rgb(0_0_0_/_90)] font-serif transition-all"
          >
            Artifex - Echoes of Heritage, Voices of Art.
          </h1>

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

          <FloatingSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={() => {}}
            showPrompt={true}
          />
        </div>
      </div>
    </>
  );
};

export default Hero06;



// import { useState } from "react";
// import { BackgroundPattern } from "./background-pattern";
// import FloatingSearchBar from "@/components/searchbar";

// const Hero06 = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   return (
//     <>
//       <div className="relative z-30 min-h-[520px] overflow-visible 
//       flex flex-col items-center justify-center px-4 sm:px-6">
//         <BackgroundPattern />

//         <div className="relative z-10 text-zinc-100 dark:text-zinc-100 text-center w-full max-w-[1200px] 
//         px-2 sm:px-4 mt-20 sm:mt-28 lg:mt-32">
//           <h1
//             className="hidden sm:block sm:text-2xl md:text-4xl lg:text-5xl font-bold mt-57 dark:mt-0
//             [text-shadow:_0_5px_5px_rgb(0_0_0_/_90)] font-serif transition-all"
//           >
//             Artifex - Echoes of Heritage, Voices of Art.
//           </h1>

//           <h1
//             className="text-4xl sm:hidden sm:text-2xl md:text-4xl lg:text-5xl font-bold  
//           [text-shadow:_0_8px_8px_rgb(0_0_0_/_10)] font-serif"
//           >
//             Artifex
//           </h1>
//           <p className="text-xl sm:hidden sm:text-2xl md:text-4xl lg:text-5xl font-bold  
//           [text-shadow:_0_8px_8px_rgb(0_0_0_/_10)] font-sans mt-5">
//             Echoes of Heritage, Voices of Art.
//           </p>

//           <FloatingSearchBar
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             handleSearch={() => {}}
//             showPrompt={true}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Hero06;







