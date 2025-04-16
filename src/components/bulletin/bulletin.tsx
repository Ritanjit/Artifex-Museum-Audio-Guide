import React, { useState, useEffect, useRef } from 'react';
import { CalendarDays, CalendarCheck, Clock, X } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface NewsItem {
  id: number;
  headline: string;
  date: string;
}

const LatestNewsBulletin = () => {
  const [news] = useState<NewsItem[]>([
    { id: 1, date: 'Mar 28', headline: 'Rare Ahom Manuscript Discovered in Upper Assam' },
    { id: 2, date: 'Mar 26', headline: 'New Exhibit: The Ancient Scripts of the Ahom Dynasty' },
    { id: 3, date: 'Mar 22', headline: 'Restoration Project: Ahom Royal Seals Being Digitized' },
    { id: 4, date: 'Mar 18', headline: 'Cultural Workshop: Learning Tai Ahom Language' },
    { id: 5, date: 'Mar 14', headline: 'Donation: 200-Year-Old Manuscript Gifted to Museum' },
    { id: 6, date: 'Mar 10', headline: 'Interactive Session: Historians Talk on Ahom Chronicles' },
  ]);

  const [events] = useState([
    { date: 'April 5, 2025', event: 'Ahom Heritage Exhibition Opening' },
    { date: 'April 12, 2025', event: 'Workshop: Ancient Manuscript Preservation' },
    { date: 'April 19, 2025', event: 'Lecture: Ahom Kings and Their Legacy' },
    { date: 'April 25, 2025', event: 'Live Calligraphy Event - Writing in Tai Ahom' },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  }, [news.length, itemHeight]);

  return (
    <div className="min-h-screen bg-stone-100 text-[#7f1d1d] dark:bg-gray-950 dark:text-white flex flex-col items-center py-12 px-4 sm:px-8 pt-40">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#7f1d1d] dark:text-amber-500">Latest Museum News & Events</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl">
          Stay updated with the latest discoveries, exhibits, and cultural events at the Assam Ahom Manuscript Museum.
        </p>
      </div>

      {/* News Bulletin */}
      <div className="mt-10 w-full max-w-4xl bg-white dark:bg-gray-900 border border-[#7f1d1d] dark:border-amber-500 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-[#7f1d1d] dark:text-amber-400 flex items-center gap-2">
          <Clock className="h-6 w-6 text-[#7f1d1d] dark:text-amber-500" /> News Headlines
        </h2>

        <div className="relative overflow-hidden h-56 mt-4" ref={containerRef}>
          <div
            className="absolute w-full"
            style={{
              transform: `translateY(-${scrollPosition}px)`,
              transition: 'transform 0.3s linear',
            }}
          >
            {news.concat(news).map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-2 text-lg text-gray-800 dark:text-gray-300">
                <div className="bg-[#7f1d1d] text-white font-bold px-3 py-1 rounded-md">{item.date}</div>
                <span className="hover:text-[#b91c1c] dark:hover:text-amber-400 cursor-pointer">{item.headline}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#7f1d1d] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#991b1b] transition"
          >
            View All News
          </button>
        </div>
      </div>

      {/* Events + Calendar */}
      <div className="mt-12 w-full max-w-4xl bg-white dark:bg-gray-900 border border-[#7f1d1d] dark:border-amber-500 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-[#7f1d1d] dark:text-amber-400 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-[#7f1d1d] dark:text-amber-500" /> Important Dates & Calendar
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-4 text-lg text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md transition hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <CalendarCheck className="h-6 w-6 text-[#7f1d1d] dark:text-amber-500" />
                <div>
                  <span className="text-[#7f1d1d] dark:text-amber-400 font-semibold">{event.date}:</span>
                  <span> {event.event}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center w-full">
            <Calendar
              className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg p-4 shadow-lg w-full"
              tileClassName={({ date }) => {
                const eventExists = events.some((e) => {
                  const eventDate = new Date(e.date);
                  return (
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                  );
                });
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                if (eventExists) {
                  return 'text-[#b91c1c] font-bold';
                } else if (isWeekend) {
                  return 'text-red-500';
                } else {
                  return '';
                }
              }}
              tileContent={({ date }) => {
                const eventExists = events.some((e) => {
                  const eventDate = new Date(e.date);
                  return (
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                  );
                });
                return eventExists ? (
                  <div className="flex justify-center items-center">
                    <span className="text-[#b91c1c] text-sm font-bold">📌</span>
                  </div>
                ) : null;
              }}
              prevLabel="‹"
              nextLabel="›"
              prev2Label="«"
              next2Label="»"
              navigationLabel={({ date }) => (
                <span className="text-black dark:text-white font-semibold text-lg">
                  {date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </span>
              )}
              formatShortWeekday={(locale, date) =>
                date.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase()
              }
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 border border-[#7f1d1d] dark:border-amber-500 rounded-lg m-6 p-6 shadow-lg max-w-lg w-full text-[#7f1d1d] dark:text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">All News</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 max-h-96 overflow-y-auto space-y-4">
              {news.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2 text-lg border-b border-gray-300 dark:border-gray-700">
                  <div className="bg-[#7f1d1d] text-white font-bold px-3 py-1 rounded-md">{item.date}</div>
                  <span>{item.headline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestNewsBulletin;
