import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import img from "../../assets/herobg.jpg";

const IntroInfoCard: React.FC = () => {

    return (
        <section className="w-full bg-stone-100 dark:bg-zinc-900 py-20 px-4 sm:px-6 lg:px-12 transition-all fade-in">
            <div className="max-w-[1330px] mx-auto rounded-3xl shadow-xl bg-white dark:bg-zinc-800 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Left Column */}
                    <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-red-900 dark:text-white">
                            Welcome to Majuli — The Spiritual Isle of Assam
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Majuli is one of the world's largest river islands, nestled on the Brahmaputra in Assam. Revered as a cultural sanctuary,
                            it is home to historic <strong>Satras</strong> — monastic institutions founded by <em>Srimanta Sankardev</em>, the saint-scholar
                            who pioneered Assamese neo-Vaishnavism.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            These Satras continue to preserve Assam’s unique classical dance <em>Sattriya</em>, devotional music, art,
                            and the renowned tradition of <strong>mukha (mask)</strong> making — vibrant creations used in <em>Bhaona</em>
                            performances that depict epics and mythology.
                        </p>
                        <div>
                            <Link
                                to="/mukha"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-red-900 
                                text-white font-semibold hover:bg-amber-500 hover:text-white 
                                transition-all duration-300 shadow-md hover:scale-101 text-xs sm:text-[15px]"
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: "instant" });
                                }}
                            >
                                Know more about Majuli & Mask Making
                                < ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Side Visual (optional illustration/photo) */}
                    <div className="hidden md:block bg-cover bg-center min-h-[300px]"
                        style={{ backgroundImage: `url(${img})` }} />
                </div>
            </div>
        </section >
    );
};

export default IntroInfoCard;
