// src/components/HeroSlider.tsx
import React from "react";
import SmartSlider from "react-smart-slider";
import bg1 from "../../assets/1.png";
import bg2 from "../../assets/2.png";
import bg3 from "../../assets/3.png";
import bg4 from "../../assets/4.png";
import bg5 from "../../assets/5.png";

// Custom images array
const slidesArray = [
    { url: bg1 },
    { url: bg2 },
    { url: bg3 },
    { url: bg4 },
    { url: bg5 },
];

const HeroSlider: React.FC = () => {
    return (
        <div className="w-full h-full relative">
            <SmartSlider
                slides={slidesArray}
                autoSlide={true}
                autoSlideInterval={6000}
                showIndicators={false}
                buttonShape="round"
                height={600}
                className="smart-slider"
            />
        </div>
    );
};

export default HeroSlider;
