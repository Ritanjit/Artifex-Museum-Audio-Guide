import React from "react";
import horaiLogo from "../../assets/horaiLogo.png";
import { useNavigate, useLocation } from "react-router";
import useVisitCounter from "../visitorCounter/VisitorCounter";
import VisitorCounter from "../visitorCounter/VisitorCounter";

export const Footer: React.FC = () => {

  const visits = useVisitCounter();

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <footer className="z-50 bg-red-950 dark:bg-neutral-900 pt-10 pb-5">
      <div className="container mx-auto px-6 sm:px-12 md:px-20">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 sm:gap-40">

          {/* Left: Logo & Description */}
          <div className="text-center md:text-left max-w-lg">
            <img
              src={horaiLogo}
              alt="Logo"
              className="h-30 w-auto mb-3 mx-auto md:mx-0 cursor-pointer"
              onClick={() => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }
              }}
            />
            <p className="text-white dark:text-gray-400 text-sm">
              Celebrating Assam's rich heritage through art, culture, and innovation.
            </p>
          </div>

          {/* Right: Links & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 sm:gap-35 w-full md:w-auto text-center sm:text-left">

            {/* Quick Links */}
            <div>
              <h1 className="text-base mb-3 font-semibold text-amber-500">Quick Links</h1>
              <ul className="space-y-2 text-white dark:text-gray-400">
                <li className="cursor-pointer hover:text-amber-500">Privacy Policy</li>
                <li className="cursor-pointer hover:text-amber-500">Disclaimer</li>
                <li className="cursor-pointer hover:text-amber-500">Terms & Conditions</li>
                <li className="cursor-pointer hover:text-amber-500">Copyright Policy</li>
              </ul>
            </div>

            {/* Contact & Follow Us */}
            <div>
              <h1 className="text-base mb-3 font-semibold text-amber-500">Contact Us</h1>
              <ul className="space-y-2 text-white dark:text-gray-400">
                <li className="cursor-pointer">23 Market Street, City</li>
                <li className="cursor-pointer">+123 456 7890</li>
                <li className="cursor-pointer">support@example.com</li>
              </ul>

              {/* Follow Us (Inside Contact Section) */}
              <div className="mt-4">
                {/* <h1 className="text-base mb-3 font-semibold text-amber-500">Follow Us</h1> */}
                <div className="flex justify-center sm:justify-start space-x-5">
                  <a href="#" className="text-white dark:text-gray-500 hover:text-amber-500">
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.65H8.031v-2.629h2.474v-1.749 c0-2.896,1.411-4.167,3.818-4.167c1.153,0,1.762,0.085,2.051,0.124v2.294h-1.642c-1.022,0-1.379,0.969-1.379,2.061v1.437h2.995 l-0.406,2.629h-2.588v7.247C18.235,21.236,22,17.062,22,12C22,6.477,17.523,2,12,2z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white dark:text-gray-500 hover:text-amber-500">
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white dark:text-gray-500 hover:text-amber-500">
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                      <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-white dark:border-gray-700 my-6"></div>

        {/* Copyright Section */}
        <div className="text-center text-white dark:text-gray-400 text-sm pb-15 sm:pb-0">
          © {new Date().getFullYear()} Artifex. All rights reserved by Artifex & Co.
        </div>
      </div>

      {/* example visitor counter */}
      <p className="text-3xl font-semibold text-gray-800 transition duration-300 
                            group-hover:scale-105">
        {/* {totalVisitors} */}
        {visits !== null ? visits.toLocaleString() : "Loading..."}
      </p>

      <VisitorCounter />

    </footer>
  );
};

export default Footer;
