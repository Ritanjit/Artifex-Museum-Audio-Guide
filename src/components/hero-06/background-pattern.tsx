"use client";

import DotPattern from "@/components/ui/dot-pattern";
import Particles from "@/components/ui/particles";
import { cn } from "@/lib/utils";
import heroBg from "../../assets/landingBg.png";
import heroImage from "../../assets/trad.jpg";
import bg from "../../assets/herobg.jpg";
import majuliBg from '../../assets/majuliDark.jpg'
import vid from "../../assets/majuli1.mp4";
import { useTheme } from "@/components/theme-provider/theme-provider";
import { ChevronDown } from "lucide-react";
import HeroSlider from "./slider";

export const BackgroundPattern = () => {
  const { theme } = useTheme();

  return (
    <>
      {theme === "dark" && (
        <div
          className="absolute inset-0 h-screen bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${majuliBg})` }}
        ></div>
      )}

      {theme === "light" && (
        <div
          className="absolute inset-0 h-[320px] bg-fixed bg-cover bg-center opacity-100"
        // style={{ backgroundImage: `url(${samoguriBg})` }}
        >
          <video
            src={vid}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Particles
        className="absolute inset-0 h-screen"
        quantity={theme == "light" ? 0 : 150}
        ease={80}
        size={1}
        color={theme === "light" ? "#8B0000" : "#1D1714"}
        refresh={true}
        staticity={50}
      />

      {/* 👇 Animated Scroll Down Arrow */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        {theme == 'dark' && <ChevronDown
          className="animate-bounce text-white h-8 w-8"
          strokeWidth={2}
        />}
      </div>

    </>
  );
};




// "use client";

// import DotPattern from "@/components/ui/dot-pattern";
// import Particles from "@/components/ui/particles";
// import { cn } from "@/lib/utils";
// import heroBg from "../../assets/landingBg.png";
// import heroImage from "../../assets/trad.jpg";
// import bg from "../../assets/herobg.jpg";
// import samoguriBg from "../../assets/samoguribg2.jpg"
// import plain from "../../assets/plain.png";
// import vid from "../../assets/majuli1.mp4";
// import { useTheme } from "@/components/theme-provider/theme-provider";
// import { ChevronDown } from "lucide-react";
// import HeroSlider from "./slider";

// export const BackgroundPattern = () => {
//   const { theme } = useTheme();

//   return (
//     <>
//       {theme === "dark" && (
//         <div
//           className="absolute inset-0 bg-cover bg-center opacity-50"
//           style={{ backgroundImage: `url(${bg})` }}
//         ></div>
//       )}

//       {theme === "light" && (
//         <div className="absolute inset-0 bg-fixed bg-cover bg-center opacity-100"
//           style={{ backgroundImage: `url(${samoguriBg})` }}>
//           {/* <video
//             src={vid}
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-full h-full object-cover"
//           /> */}
//         </div>
//       )}

//       <Particles
//         className="absolute inset-0"
//         quantity={theme == "light" ? 0 : 150}
//         ease={80}
//         size={1}
//         color={theme === "light" ? "#8B0000" : "#1D1714"}
//         refresh
//       />

// {/* 👇 Animated Scroll Down Arrow */}
// <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50">
//   <ChevronDown
//     className="animate-bounce text-white dark:text-amber-500 h-8 w-8"
//     strokeWidth={2}
//   />
// </div>
//     </>
//   );
// };
