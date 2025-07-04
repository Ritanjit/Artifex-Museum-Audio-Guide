import React from 'react';
import { Home, ArrowLeft, Search, MapIcon, Map } from 'lucide-react';
import FuzzyText from '@/components/ui/fuzzyText';

const NotFound: React.FC = () => {

    const enableHover = true; // or false if you don't want hover effect
    const hoverIntensity = 0.5; // adjust this value between 0 and 1 as needed

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-red-950 flex items-center justify-center px-4 pt-35 sm:pt-45 pb-20">
            <div className="max-w-2xl mx-auto text-center">
                {/* Animated Museum Icons */}
                <div className="flex justify-center space-x-4">
                    {/* Ancient Vase */}
                    <div className="animate-bounce delay-200">
                        <svg className="w-16 h-16 text-red-800 dark:text-red-900" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c-2 0-3 1-3 2v1c0 .5-.5 1-1 1s-1 .5-1 1v2c0 3 1 6 4 8v5c0 1 1 2 2 2s2-1 2-2v-5c3-2 4-5 4-8V7c0-.5-.5-1-1-1s-1-.5-1-1V4c0-1-1-2-3-2z" />
                            <ellipse cx="12" cy="8" rx="2" ry="1" className="fill-white dark:fill-gray-800 opacity-30" />
                            <ellipse cx="12" cy="12" rx="1.5" ry="0.5" className="fill-white dark:fill-gray-800 opacity-20" />
                        </svg>
                    </div>

                    {/* Picture Frame */}
                    <div className="animate-bounce delay-100">
                        <svg className="w-16 h-16 text-red-800 dark:text-red-900" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                            <circle cx="9" cy="9" r="2" className="fill-current opacity-60" />
                            <path d="m15.5 11-4.5 6-2-2.5L5 18h14l-3.5-7z" className="fill-current opacity-60" />
                        </svg>
                    </div>

                    {/* Ancient Vase */}
                    <div className="animate-bounce delay-200">
                        <svg className="w-16 h-16 text-red-800 dark:text-red-900" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c-2 0-3 1-3 2v1c0 .5-.5 1-1 1s-1 .5-1 1v2c0 3 1 6 4 8v5c0 1 1 2 2 2s2-1 2-2v-5c3-2 4-5 4-8V7c0-.5-.5-1-1-1s-1-.5-1-1V4c0-1-1-2-3-2z" />
                            <ellipse cx="12" cy="8" rx="2" ry="1" className="fill-white dark:fill-gray-800 opacity-30" />
                            <ellipse cx="12" cy="12" rx="1.5" ry="0.5" className="fill-white dark:fill-gray-800 opacity-20" />
                        </svg>
                    </div>

                </div>

                {/* Spinning Circle Behind 404 */}
                <div className="relative mb-6 flex justify-center items-center">
                    {/* <div className="absolute animate-spin-slow">
                        <div className="w-28 h-28 border-4 border-red-950/20 border-t-red-950/40 dark:border-red-400/20 dark:border-t-red-400/40 rounded-full"></div>
                    </div> */}

                    {/* Error Code */}
                    {/* <h1 className="text-8xl font-bold text-red-950 dark:text-red-400 animate-pulse z-10">
                        404
                    </h1> */}

                    <FuzzyText
                        baseIntensity={0.2}
                        hoverIntensity={hoverIntensity}
                        enableHover={enableHover}
                        fontSize="8rem"
                        fontWeight={900}
                        color="#991b1b" // dark red color - adjust as needed
                    >
                        404
                    </FuzzyText>

                </div>

                <div className="relative mb-6 flex justify-center items-center">
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        <FuzzyText
                            baseIntensity={0.2}
                            hoverIntensity={hoverIntensity}
                            enableHover={enableHover}
                            fontSize="2rem"
                            fontWeight={900}
                            color="#991b1b" // dark red color - adjust as needed
                        >
                            Page Not Found :(
                        </FuzzyText>
                    </p></div>

                {/* Divider */}
                <div className="w-24 h-1 bg-gradient-to-r from-red-950 to-red-700 dark:from-red-400 dark:to-red-600 mx-auto rounded-full mb-2"></div>


                {/* Main Message */}
                <div className="mb-8">
                    <h1 className="text-4xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                        পৃষ্ঠা পোৱা নগ'ল
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-screen mx-auto leading-relaxed">
                        The cultural artifact you're looking for seems to have wandered off like a traditional Assamese folk tale.
                        Let's guide you back to our museum's treasures.
                    </p>
                </div>

                {/* Moving Dots */}
                <div className="flex justify-center">
                    <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 bg-red-950 dark:bg-red-400 rounded-full animate-pulse`}
                                style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center gap-2 px-6 py-3 bg-red-950 text-white rounded-lg hover:bg-red-900 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="group flex items-center gap-2 px-6 py-3 bg-white text-red-950 border-2 border-red-950 rounded-lg hover:bg-red-950 hover:text-white transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <Home className="w-4 h-4" />
                        Return Home
                    </button>
                </div>

                {/* Additional helpful links */}
                <div className="pt-8 border-t border-stone-200 mt-12">
                    <p className="text-sm text-stone-500 mb-4">
                        You might want to explore:
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/visit"
                            className="group flex items-center gap-2 text-stone-600 hover:text-red-950 transition-colors text-sm"
                        >
                            <Map className="w-4 h-4" />
                            Visit Museum
                        </a>
                        <a
                            href="/collections"
                            className="group flex items-center gap-2 text-stone-600 hover:text-red-950 transition-colors text-sm"
                        >
                            <Search className="w-4 h-4" />
                            Search Collection
                        </a>
                    </div>
                </div>

                {/* Cultural Quote */}
                <div className="mt-12 p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-red-100 dark:border-red-900/30">
                    <blockquote className="text-slate-600 dark:text-slate-300 italic">
                        "যত আছে মোৰ দেহত প্ৰাণ, সিমান আছে মোৰ আশা"
                    </blockquote>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        - Traditional Assamese Wisdom
                    </p>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-950/20 dark:bg-red-400/20 rounded-full animate-ping"></div>
                    <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-red-700/30 dark:bg-red-500/30 rounded-full animate-ping delay-1000"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-red-800/25 dark:bg-red-300/25 rounded-full animate-ping delay-2000"></div>
                    <div className="absolute bottom-1/2 left-1/3 w-1.5 h-1.5 bg-red-800/25 dark:bg-red-300/25 rounded-full animate-ping delay-2000"></div>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>


        </div>
    );
};

export default NotFound;