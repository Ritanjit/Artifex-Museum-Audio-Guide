import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Visit = () => {
  return (
    <div className="bg-stone-100 dark:bg-gray-950 text-red-900 dark:text-gray-100 py-30 px-8 md:px-24 lg:px-40">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-red-900 dark:text-amber-500 mb-4">
          Visit the Manuscript Museum
        </h2>
        <p className="text-gray-700 dark:text-gray-400 mb-8">
          Step into history and explore ancient manuscripts. Contact us for guided tours, research access, or any inquiries.
        </p>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: <FaMapMarkerAlt />, title: "Address", detail: "Manuscript Museum, Guwahati, Assam, India" },
          { icon: <FaPhoneAlt />, title: "Phone", detail: "+91 98765 43210" },
          { icon: <FaEnvelope />, title: "Email", detail: "contact@manuscriptmuseum.com" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group bg-white dark:bg-gray-800 p-6 rounded-md flex flex-col items-center 
            text-center transition duration-300 hover:bg-red-900 dark:hover:bg-amber-500 
            hover:text-white dark:hover:text-black border border-red-900 dark:border-gray-700"
          >
            <div className="text-3xl mb-2 text-red-900 dark:text-amber-500 group-hover:text-white 
            dark:group-hover:text-black transition duration-300">
              {item.icon}
            </div>
            <h3 className="font-semibold mb-1 text-red-900 dark:text-amber-500 group-hover:text-white 
            dark:group-hover:text-black">
              {item.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white 
            dark:group-hover:text-black">
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Map and Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl shadow-md overflow-hidden border border-red-200 dark:border-gray-700">
          <div className="relative pb-[100%]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.9494672456817!2d91.62025427519629!3d26.
              13319057712037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a43f4d6353b7d%3A0x5089bf544bea3b23!
              2sGirijananda%20Chowdhury%20University!5e0!3m2!1sen!2sin!4v1743228907937!5m2!1sen!2sin"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md border border-red-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-red-900 dark:text-amber-500 mb-4">Contact Us</h3>
          <p className="text-gray-700 dark:text-gray-400 mb-6">
            Fill out the form below, and our team will get back to you within 24 hours.
          </p>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                className="w-full border border-red-200 dark:border-gray-700 rounded-md p-3 bg-white 
                dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 
                focus:border-red-900"
                placeholder="Full Name (e.g., Dr. Rajesh Sharma)"
              />
            </div>
            <div>
              <input
                type="email"
                className="w-full border border-red-200 dark:border-gray-700 rounded-md p-3 bg-white 
                dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 
                focus:border-red-900"
                placeholder="Email (e.g., example@email.com)"
              />
            </div>
            <div>
              <input
                type="tel"
                className="w-full border border-red-200 dark:border-gray-700 rounded-md p-3 bg-white 
                dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 
                focus:border-red-900"
                placeholder="Phone (e.g., +91 98765 43210)"
              />
            </div>
            <div>
              <textarea
                rows={5}
                className="w-full border border-red-200 dark:border-gray-700 rounded-md p-3 bg-white 
                dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 
                focus:border-red-900"
                placeholder="How can we assist you? (Please provide detailed information)"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-md w-full transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Visit;
