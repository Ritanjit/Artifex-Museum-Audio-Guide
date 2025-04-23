import React, { useState, useEffect, useRef } from "react";
import { CalendarCheck, Clock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const HomeNewsHighlights: React.FC = () => {

  const [news] = useState([
    { id: 1, date: "Mar 28", headline: "Rare Ahom Manuscript Discovered in Upper Assam" },
    { id: 2, date: "Mar 26", headline: "New Exhibit: The Ancient Scripts of the Ahom Dynasty" },
    { id: 3, date: "Mar 22", headline: "Restoration Project: Ahom Royal Seals Being Digitized" },
    { id: 4, date: "Mar 18", headline: "Cultural Workshop: Learning Tai Ahom Language" },
  ]);

  const [events] = useState([
    { date: "April 5, 2025", event: "Ahom Heritage Exhibition Opening" },
    { date: "April 12, 2025", event: "Workshop: Ancient Manuscript Preservation" },
    { date: "April 19, 2025", event: "Lecture: Ahom Kings and Their Legacy" },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollSpeed = 0.5;
  const itemHeight = 40;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + scrollSpeed;
        const contentHeight = news.length * itemHeight;
        return newPosition > contentHeight ? 0 : newPosition;
      });
    }, 30);

    return () => clearInterval(intervalId);
  }, [news.length]);

  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 lg:px-10 w-full bg-stone-100 dark:bg-black/70 backdrop-blur-md py-20">
      <div className="max-w-[1330px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* News Headlines */}
          <div className="border-2 border-red-900 dark:border-white bg-white dark:bg-white/5 
          backdrop-blur-lg rounded-2xl p-6 shadow-lg h-full fade-in">
            <h2 className="text-xl font-semibold text-red-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5" /> NOTICE BOARD
            </h2>
            <div className="relative overflow-hidden h-52 mt-4" ref={containerRef}>
              <div
                className="absolute w-full"
                style={{
                  transform: `translateY(-${scrollPosition}px)`,
                  transition: "transform 0.3s linear",
                }}
              >
                {news.concat(news).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-2 text-sm sm:text-base text-gray-800 dark:text-gray-200"
                  >
                    <div className="bg-red-900 text-white font-bold px-3 py-1 rounded-md">{item.date}</div>
                    <span className="hover:text-red-900 cursor-pointer">{item.headline}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="border-2 border-red-900 dark:border-white bg-white/80 
          dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-lg 
          h-full flex flex-col justify-between fade-in">
            <div>
              <h2 className="text-xl font-semibold text-red-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />  FORTHCOMING EVENTS
              </h2>
              <div className="mt-4 space-y-4">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm sm:text-base text-gray-800 dark:text-gray-200 
                    bg-gray-100 dark:bg-black/50 p-3 rounded-lg shadow-md cursor-pointer
                    hover:bg-gray-200 dark:hover:bg-black/60 transition"
                  >
                    <CalendarCheck className="h-5 w-5 text-red-900 dark:text-red-900 mt-1" />
                    <div>
                      <span className="text-red-900 dark:text-red-900 font-semibold">{event.date}:</span>
                      <span> {event.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View More Button */}
            <div className="mt-6 text-right">
              <Button
                variant="ghost"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-red-900 cursor-pointer
                dark:text-red-400 hover:text-amber-500 dark:hover:text-red-300 transition hover:!bg-transparent"
                onClick={() => {
                    navigate("events");
                    window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                View More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNewsHighlights;
