// src/components/HomeNewsHighlights.tsx
import React, { useState, useEffect, useRef } from "react";
import { CalendarCheck, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="bg-gray-950 text-white py-8 px-4 sm:px-6 lg:px-10 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* News Headlines */}
          <div className="bg-gray-900 border border-amber-500 rounded-lg p-6 shadow-lg h-full">
            <h2 className="text-xl font-semibold text-amber-400 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" /> News Headlines
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
                  <div key={index} className="flex items-center gap-4 py-2 text-sm sm:text-base text-gray-300">
                    <div className="bg-amber-500 text-black font-bold px-3 py-1 rounded-md">{item.date}</div>
                    <span className="hover:text-amber-400 cursor-pointer">{item.headline}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gray-900 border border-amber-500 rounded-lg p-6 shadow-lg h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-amber-400 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-amber-500" /> Upcoming Events
              </h2>
              <div className="mt-4 space-y-4">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm sm:text-base text-gray-300 bg-gray-800 
                    p-3 rounded-lg shadow-md hover:bg-gray-700 transition"
                  >
                    <CalendarCheck className="h-5 w-5 text-amber-500 mt-1" />
                    <div>
                      <span className="text-amber-400 font-semibold">{event.date}:</span>
                      <span> {event.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View More Button */}
            <div className="mt-6 text-right">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-amber-400 hover:text-amber-300 transition"
              >
                View More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNewsHighlights;
