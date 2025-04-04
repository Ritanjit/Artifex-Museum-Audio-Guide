import { Briefcase, Users, Linkedin } from "lucide-react";
import rit from "../../assets/rit.jpg"
import san from "../../assets/san.jpg"
import sub from "../../assets/sub.jpg"

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      {/* Navbar Space */}
      <div className="h-20"></div> {/* Space for navbar */}

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-500 mb-4">About Us</h1>
        <p className="text-lg text-gray-300">
          Welcome to <span className="text-amber-400 font-semibold font-serif">ARTIFEX</span>,
          where history whispers, art speaks, and heritage comes alive.
        </p>
      </div>

      {/* Our Mission & Aim Section */}
      <div className="mt-12 max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Briefcase className="h-12 w-12 sm:h-25 sm:w-auto text-amber-400" />
          <div>
            <h2 className="text-2xl font-semibold text-white text-center sm:text-left">Our Mission</h2>
            <p className="text-gray-400 mt-2 text-center sm:text-left">
              We strive to preserve, celebrate, and reimagine heritage through the lens of
              art and technology. Our mission is to create an immersive digital experience
              that connects the past with the present, making history more accessible,
              engaging, and inspiring for all.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <Users className="h-12 w-12  text-amber-400" />
          <div>
            <h2 className="text-2xl font-semibold text-white text-center sm:text-left">Our Team</h2>
            <p className="text-gray-400 mt-2 text-center sm:text-left">
              A group of CSE students from Girijananda Chowdhury University
              driven by a shared passion for art and innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        
        {/* Team Member 1 */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center text-center 
          transition-transform transform hover:-translate-y-2 hover:shadow-xl duration-300">
          <img src={rit} alt="Member 1" className="w-32 h-32 rounded-full shadow-md"/>
          <h3 className="text-xl font-semibold mt-4">Ritanjit Das</h3>
          <p className="text-sm text-gray-400">Computer Science & Engineering</p>
          <p className="text-sm text-gray-500">Roll No: 42</p>
          <div className="flex mt-3">
            <a href="https://www.linkedin.com/in/ritanjit-das-530b7b216" target="_blank" rel="noopener noreferrer" 
              className="text-blue-500 hover:text-blue-400 transition">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          {/* Dummy Message */}
          <p className="mt-4 bg-gray-800 p-3 rounded-lg text-gray-300 italic shadow-md">
            "Bringing innovative solutions, one step at a time."
          </p>
        </div>

        {/* Team Member 2 */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center text-center 
          transition-transform transform hover:-translate-y-2 hover:shadow-xl duration-300">
          <img src={san} alt="Member 2" className="w-32 h-32 rounded-full shadow-md"/>
          <h3 className="text-xl font-semibold mt-4">Sandilya Baruah</h3>
          <p className="text-sm text-gray-400">Computer Science & Engineering</p>
          <p className="text-sm text-gray-500">Roll No: 45</p>
          <div className="flex mt-3">
            <a href="https://www.linkedin.com/in/sandilya-baruah-40973a212 " target="_blank" rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          {/* Dummy Message */}
          <p className="mt-4 bg-gray-800 p-3 rounded-lg text-gray-300 italic shadow-md">
            "A journey of a thousand miles begins with a single step – and a few lines of code."
          </p>
        </div>

        {/* Team Member 3 */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center text-center 
          transition-transform transform hover:-translate-y-2 hover:shadow-xl duration-300">
          <img src={sub} alt="Member 3" className="w-32 h-32 rounded-full shadow-md"/>
          <h3 className="text-xl font-semibold mt-4">Subhrajyoti Goswami</h3>
          <p className="text-sm text-gray-400">Computer Science & Engineering</p>
          <p className="text-sm text-gray-500">Roll No: 49</p>
          <div className="flex mt-3">
            <a href="https://www.linkedin.com/in/subhrajyoti-goswami-6b28a7250" target="_blank" rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          {/* Dummy Message */}
          <p className="mt-4 bg-gray-800 p-3 rounded-lg text-gray-300 italic shadow-md">
            "Tech and creativity – a perfect blend for the future."
          </p>
        </div>

      </div>

      {/* Call To Action */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold text-gray-300">Want to know more?</h3>
        <p className="text-gray-400">Feel free to connect with us or explore our projects.</p>
        <a
          href="/visit"
          className="mt-4 inline-block bg-amber-500 text-black px-6 py-2 rounded-full 
          hover:bg-amber-600 transition font-medium"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
