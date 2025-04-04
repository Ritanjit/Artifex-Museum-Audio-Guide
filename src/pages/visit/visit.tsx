import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Visit = () => {
  return (
    <div className="bg-gray-950 text-gray-100 py-30 px-8 md:px-24 lg:px-40">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-amber-500 mb-4">Visit the Manuscript Museum</h2>
        <p className="text-gray-400 mb-8">
          Step into history and explore ancient manuscripts. Contact us for guided tours, research access, or any inquiries.
        </p>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="group bg-gray-800 p-6 rounded-md flex flex-col items-center text-center transition duration-300 hover:bg-amber-500 hover:text-black">
          <FaMapMarkerAlt className="text-3xl mb-2 transition duration-300 text-amber-500 group-hover:text-black" />
          <h3 className="font-semibold mb-1 text-amber-500 transition duration-300 group-hover:text-black">
            Address
          </h3>
          <p className="text-sm">Manuscript Museum, Guwahati, Assam, India</p>
        </div>
        <div className="group bg-gray-800 p-6 rounded-md flex flex-col items-center text-center transition duration-300 hover:bg-amber-500 hover:text-black">
          <FaPhoneAlt className="text-3xl mb-2 transition duration-300 text-amber-500 group-hover:text-black" />
          <h3 className="font-semibold mb-1 text-amber-500 transition duration-300 group-hover:text-black">
            Phone
          </h3> 
          <p className="text-sm">+91 98765 43210</p>
        </div>
        <div className="group bg-gray-800 p-6 rounded-md flex flex-col items-center text-center transition duration-300 hover:bg-amber-500 hover:text-black">
          <FaEnvelope className="text-3xl mb-2 transition duration-300 text-amber-500 group-hover:text-black" />
          <h3 className="font-semibold mb-1 text-amber-500 transition duration-300 group-hover:text-black">
            Email
          </h3>
          <p className="text-sm">contact@manuscriptmuseum.com</p>
        </div>
      </div>

      {/* Map and Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-full">
      <div className="rounded-xl shadow-md overflow-hidden">
  <div className="relative pb-[100%] lg:pb-[100%]"> {/* Square on mobile, 60% aspect ratio on desktop */}
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.9494672456817!2d91.62025427519629!3d26.13319057712037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a43f4d6353b7d%3A0x5089bf544bea3b23!2sGirijananda%20Chowdhury%20University!5e0!3m2!1sen!2sin!4v1743228907937!5m2!1sen!2sin"
      className="absolute top-0 left-0 w-full h-full border-0"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</div>
        <div className="bg-gray-900 p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-amber-500 mb-4">Contact Us</h3>
          <p className="text-gray-400 mb-6">
            Fill out the form below, and our team will get back to you within 24 hours.
          </p>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-700 rounded-md p-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Full Name (e.g., Dr. Rajesh Sharma)"
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-700 rounded-md p-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Email (e.g., example@email.com)"
              />
            </div>
            <div>
              <input
                type="tel"
                id="phone"
                className="w-full border border-gray-700 rounded-md p-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Phone (e.g., +91 98765 43210)"
              />
            </div>
            <div>
              <textarea
                id="message"
                rows={5}
                className="w-full border border-gray-700 rounded-md p-3 mb-2 bg-gray-800 text-white placeholder-gray-500 focus:ring-amber-500 focus:border-amber-500"
                placeholder="How can we assist you? (Please provide detailed information)"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-6 rounded-md w-full transition"
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
