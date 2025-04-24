import React from "react";
import { Link } from "react-router-dom";
import Banner from "./banner";
import "./mukha.css"; // Custom CSS for fade-in etc.

const MukhasBlog: React.FC = () => {
    return (
        <div className="bg-stone-100 dark:bg-black text-red-900 dark:text-white min-h-screen">
            <Banner />

            <div className="relative z-10 px-4 sm:px-8 py-12">
                <div className="max-w-[1400px] mx-auto rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl p-6 sm:p-10">
                    <article className="prose dark:prose-invert lg:prose-lg max-w-none space-y-16">

                        {/* Title */}
                        <header className="text-center fade-in">
                            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-3">
                                Types of Mukhas in Majuli, Assam
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Discover the sacred art of Mukhas – masks that tell stories of devotion and folklore.
                            </p>
                        </header>

                        {/* Intro */}
                        <section className="fade-in px-4 sm:px-8 md:px-20 space-y-4 text-justify">
                            <p className="text-sm sm:text-base">
                                Majuli, the world's largest river island, nestled in the Brahmaputra River in Assam, is a cradle of Assamese neo-Vaishnavite culture and spiritualism. Beyond its serene landscapes and satras (monasteries), Majuli is acclaimed for its rich craftsmanship—especially the centuries-old tradition of making sacred masks known as <strong>“Mukhas.”</strong>
                            </p>
                            <p className="text-sm sm:text-base">
                                These masks are more than props; they are spiritual extensions of Assamese folklore and mythological expression. Central to the Sattriya theatre art form introduced by the saint-reformer <strong>Srimanta Sankardev</strong> in the 15th century, Mukhas are vital in portraying characters during <em>Bhaona</em>—dramatic narrations of religious stories.
                            </p>
                            <p className="text-sm sm:text-base">
                                The <strong>Sri Sri Samaguri Satra</strong> in Majuli has preserved and elevated this art form through generations. Mask-making is passed down through oral tradition, with young disciples learning the craft alongside spiritual teachings. The art now attracts scholars, researchers, and tourists from around the globe who come to experience a living heritage.
                            </p>
                        </section>

                        {/* Mukha Cards Start */}
                        {/* Barmukha */}
                        <section className="fade-in bg-stone-100 dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-lg 
                        grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-4 sm:px-8 md:mx-10">
                            <div className="text-center">
                                <img
                                    src="/src/assets/barmukha.jpg"
                                    alt="Barmukha"
                                    className="w-full max-w-[220px] sm:max-w-xs mx-auto rounded-xl border-2 
                                    border-red-900 shadow-md hover:scale-101 duration-500"
                                />
                                <figcaption className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">
                                    Barmukha representing mythological demons
                                </figcaption>
                            </div>
                            <div className="text-justify sm:mr-20">
                                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-5">
                                    1. Barmukha (Great Mask)
                                </h2>
                                <p className="text-sm sm:text-base">
                                    Barmukhas are grand and elaborate masks that cover both the head and torso, making the wearer appear gigantic. These masks are usually over 10 feet tall and are most often used to represent larger-than-life figures from epics like Ravana, Kumbhakarna, or Narakasura.
                                </p>
                                <p className="text-sm sm:text-base">
                                    Crafted with structural bamboo frameworks and padded with clay and cotton, Barmukhas are carried or supported by multiple performers during dramatic sequences. Their exaggerated facial features—wide eyes, sharp teeth, and fierce expressions—evoke awe and fear, aligning with their demonic representations in Assamese Bhaona.
                                </p>
                                <p className="text-sm sm:text-base">
                                    Due to their scale and artistic complexity, Barmukhas require meticulous detailing and weeks of preparation. They are rare and typically reserved for special religious or cultural performances.
                                </p>
                            </div>
                        </section>

                        {/* Lotokai-Mukha */}
                        <section className="fade-in bg-stone-100 dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-lg 
                        grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-4 sm:px-8 md:mx-10">
                            <div className="text-center">
                                <img
                                    src="/src/assets/Lotokari-Mukha.jpg"
                                    alt="Lotokai-Mukha"
                                    className="w-full max-w-[220px] sm:max-w-xs mx-auto rounded-xl border-2 
                                    border-red-900 shadow-md hover:scale-101 duration-500"
                                />
                                <figcaption className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">
                                    Movable mask representing Hanuman
                                </figcaption>
                            </div>
                            <div className="text-justify sm:mr-20">
                                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-5 text-left">
                                    2. Lotokai-Mukha (Hanging/Animated Mask)
                                </h2>
                                <p className="text-sm sm:text-base">
                                    Lotokai-Mukhas are animated masks designed with movable jaws, eyes, and sometimes ears or eyebrows. These features enhance the theatrical impact by giving performers the ability to express emotions dynamically—be it anger, shock, or joy.
                                </p>
                                <p className="text-sm sm:text-base">
                                    This type of mask is commonly used to depict beings that undergo transformations or magical appearances during the play. Characters like Hanuman (during his leap or fight scenes), Putana, or the demon Maricha are commonly performed using these masks.
                                </p>
                                <p className="text-sm sm:text-base">
                                    The movement is controlled via strings or levers, integrated discreetly into the performer’s hand gestures or head movement. It’s a perfect fusion of puppetry and performance art rooted in traditional Assamese storytelling.
                                </p>
                            </div>
                        </section>

                        {/* Mukh-Mukha */}
                        <section className="fade-in bg-stone-100 dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-lg 
                        grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-4 sm:px-8 md:mx-10">
                            <div className="text-center">
                                <img
                                    src="/src/assets/mukh-mukha.jpg"
                                    alt="Mukh-Mukha"
                                    className="w-full max-w-[220px] sm:max-w-xs mx-auto rounded-xl border-2 
                                    border-red-900 shadow-md hover:scale-101 duration-500"
                                />
                                <figcaption className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">
                                    Mukh-Mukha used in Sattriya performances
                                </figcaption>
                            </div>
                            <div className="text-justify sm:mr-20">
                                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-5">
                                    3. Mukh-Mukha (Face Mask)
                                </h2>
                                <p className="text-sm sm:text-base">
                                    Mukh-Mukhas are face masks that are worn like a helmet or attached with a string. Unlike the other two types, these masks do not obstruct the performer's body movement, making them ideal for expressive dance and fluid motion on stage.
                                </p>
                                <p className="text-sm sm:text-base">
                                    These masks are highly popular and used for characters such as divine beings (Garuda, Hanuman), sages, or even demons. The artist can interact directly with the audience using expressive body language while maintaining the sacred look of the mask.
                                </p>
                                <p className="text-sm sm:text-base">
                                    Because of their balance between form and function, Mukh-Mukhas are often gifted, sold, or collected as sacred art pieces. They're seen not just in temples and festivals but also in art galleries, homes, and museums.
                                </p>
                            </div>
                        </section>

                        {/* Mukha Cards End */}

                        {/* Crafting Process */}
                        <section className="fade-in px-4 sm:px-8 md:px-20 space-y-4 text-justify">
                            <h2 className="text-3xl font-semibold mb-4">Crafting Process</h2>
                            <p className="text-sm sm:text-base">
                                The mask-making process is both a spiritual and technical endeavor. Artisans start with <strong>jati bamboo</strong>, which is harvested at around 3 years of age for its flexibility and strength. The bamboo is split and woven into a base structure that gives the mask its shape.
                            </p>
                            <p className="text-sm sm:text-base">
                                The frame is then layered with a blend of natural materials—cotton cloth dipped in a mix of clay, cow dung, and water. This composite is applied repeatedly to form a textured base, which is then left to sun-dry for several days. The drying process ensures durability and structure integrity.
                            </p>
                            <p className="text-sm sm:text-base">
                                Once the mask hardens, it is smoothed and painted using organic, eco-friendly pigments. <strong>Bael gum</strong> (from the wood apple tree) is used as a binder, while colors are extracted from materials such as <em>indigo leaves</em> (blue), <em>vermilion</em> (red), <em>charcoal</em> (black), and <em>white clay</em>. Gold and silver foil is also used to accentuate divine characters.
                            </p>
                            <p className="text-sm sm:text-base">
                                Some masks include movable parts—like blinking eyes or opening mouths—activated by strings or simple lever mechanisms, adding dynamic expression during performances. These masks take weeks or even months to complete, depending on complexity and size.
                            </p>
                        </section>

                        {/* Cultural Significance */}
                        <section className="fade-in px-4 sm:px-8 md:px-20 space-y-4 text-justify">
                            <h2 className="text-3xl font-semibold mb-4">Cultural Significance</h2>
                            <p className="text-sm sm:text-base">
                                Mukhas serve as a visual embodiment of stories from the <em>Bhagavata Purana</em> and other sacred scriptures. They are deeply integrated into the rituals and teachings of Assam's <strong>neo-Vaishnavite</strong> movement, symbolizing good versus evil, devotion, transformation, and divine intervention.
                            </p>
                            <p className="text-sm sm:text-base">
                                During <strong>Bhaona</strong> performances, which combine music, dance, and drama, these masks are not merely worn—they are “invoked.” Performers undergo ritual purification before donning the mask, emphasizing the sacred connection between the character and the actor.
                            </p>
                            <p className="text-sm sm:text-base">
                                In contemporary times, Mukhas have found their way into art galleries, global exhibitions, and academic curriculums. Their vibrant forms have transcended theatre to become emblems of Assamese identity. Many are now preserved in museums like the <strong>Majuli Mask Museum</strong> and are commissioned for cultural festivals, thus sustaining the art economically and spiritually.
                            </p>
                        </section>

                        {/* CTA */}
                        <div className="mt-10 mb-5 sm:mt-16 text-center fade-in">
                            <Link
                                to="/collections"
                                className="inline-block bg-red-900 hover:bg-amber-500 text-white 
                                font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg hover:scale-101 
                                transition-all duration-300 text-sm sm:text-base"
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: "instant" });
                                }}
                            >
                                Explore Mukha Collections
                            </Link>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default MukhasBlog;
