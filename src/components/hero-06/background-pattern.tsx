"use client";

import DotPattern from "@/components/ui/dot-pattern";
import Particles from "@/components/ui/particles";
import { cn } from "@/lib/utils";
import heroBg from "../../assets/landingBg.png";
import heroImage from "../../assets/trad.jpg";
import bg from "../../assets/herobg.jpg";
import { useTheme } from "@/components/theme-provider/theme-provider"

export const BackgroundPattern = () => {
  const { theme } = useTheme();
  // const isLightTheme = resolvedTheme === "light";

  return (
    <>

      {/* <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(ellipse,rgba(0,0,0,0.3)_30%,black_50%)]",
          "dark:fill-slate-700"
        )}
      /> */}

        {/* {/* Full Page Background */}

        {theme !== "light" && (
          <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${bg})` }}>
          </div>
        )}
        {theme !== "dark" && (
          <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${bg})` }}>
          </div>
        )}
      
      <Particles
        className="absolute inset-0"
        quantity={150}
        ease={80}
        size={1}
        // color={isLightTheme ? "#FFFF00" : "#FFFF00"}
        color="#1D1714"
        refresh
      />

    </>
  );
};
