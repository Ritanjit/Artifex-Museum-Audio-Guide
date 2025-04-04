"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper-bundle.css";

// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import bg from "../../assets/landingBg.png";
import bg1 from "../../assets/herobg.jpg";
import bg2 from "../../assets/samaguri bg.jpg";
import bg3 from "../../assets/samaguri entrance.jpg";
import bg4 from "../../assets/Samaguri-Satra-Museum.webp";
import { BackgroundPattern } from "../hero-06/background-pattern";

const Carousel: React.FC = () => {
    return (
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center 
        absolute bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}>

        {/* <BackgroundPattern /> */}

        <div className="relative w-[90%] min-w-[900px] max-w-[1200px] h-[34vw] 
        max-h-[500px] rounded-4xl overflow-hidden mx-auto m-40 flex items-center justify-center">

        <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full h-full"
        >
            <SwiperSlide>
            <div className="flex items-center justify-center bg-blue-500
            text-white text-2xl font-semibold w-full h-full
            absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg1})` }}>
                {/* Slide 1 */}
            </div>
            </SwiperSlide>
            <SwiperSlide>
            <div className="flex items-center justify-center bg-blue-500
            text-white text-2xl font-semibold w-full h-full
            absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg2})` }}>
                {/* Slide 2 */}
            </div>
            </SwiperSlide>
            <SwiperSlide>
            <div className="flex items-center justify-center bg-blue-500
            text-white text-2xl font-semibold w-full h-full
            absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg3})` }}>
                {/* Slide 3 */}
            </div>
            </SwiperSlide>
            <SwiperSlide>
            <div className="flex items-center justify-center bg-blue-500
            text-white text-2xl font-semibold w-full h-full
            absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg4})` }}>
                {/* Slide 4 */}
            </div>
            </SwiperSlide>
        </Swiper>
        </div>
        </div>
    );
};

export default Carousel;
