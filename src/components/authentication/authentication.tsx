import React, { useState } from "react";
import { FaApple, FaGoogle, FaXTwitter } from "react-icons/fa6";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SamaguriEntrance from "../../assets/samaguri entrance.jpg";
import horai from "../../assets/horai.png";
import vid from "../../assets/majuli1.mp4";

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen flex items-center justify-center bg-stone-100 text-red-950">
      <div className="w-full h-full flex flex-col lg:flex-row-reverse">
        {/* Right Section */}
        <div className="lg:w-1/2 xl:w-5/12 flex flex-col justify-center 
        bg-white shadow-lg h-full pt-28">
          <div className="flex justify-center mb-6">
            <img src={horai} alt="Logo" className="w-20 h-auto" />
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-6 mb-5">
            <button
              onClick={() => setActiveTab("login")}
              className={`py-3 px-12.5 rounded-lg font-semibold text-sm cursor-pointer ${activeTab === "login"
                ? "bg-red-900 text-white"
                : "border-2 border-red-900 text-red-900"
                }`}
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-3 px-12.5 rounded-lg font-semibold text-sm cursor-pointer ${activeTab === "signup"
                ? "bg-red-900 text-white"
                : "border-2 border-red-900 text-red-900"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form area */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center">
            {/* Divider */}
            <div className="flex items-center gap-2 text-red-900 mb-4 w-full max-w-xs">
              <div className="h-px bg-red-900 flex-1" />
              <span className="text-xs">{activeTab === "signup" ? "Sign Up" : "Log In"}</span>
              <div className="h-px bg-red-900 flex-1" />
            </div>

            {/* Form fields */}
            <div className="w-full max-w-xs space-y-4">
              {activeTab === "signup" && (
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border border-red-900 rounded-lg p-3 text-sm focus:outline-none"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-red-900 rounded-lg p-3 text-sm focus:outline-none"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-red-900 rounded-lg p-3 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ?
                    <FiEyeOff size={18} className="text-red-900" /> :
                    <FiEye size={18} className="text-red-900" />}
                </button>
              </div>

              {/* Confirm Password only for signup */}
              {activeTab === "signup" && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full border border-red-900 rounded-lg p-3 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ?
                    <FiEyeOff size={18} className="text-red-900" /> :
                    <FiEye size={18} className="text-red-900" />}
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" id="remember" className="accent-red-800 mt-1 cursor-pointer" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <button className="bg-red-900 text-white py-3 rounded-lg text-sm w-full 
              hover:bg-red-800 transition-all cursor-pointer">
                {activeTab === "signup" ? "Let's Start" : "Log In"}
              </button>
            </div>
          </div>
        </div>

        {/* Left Section */}
        <div
          className="hidden lg:flex flex-1 h-full"
        // style={{
        //   backgroundImage: `url(${SamaguriEntrance})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
        />
        <video
          src={vid}
          autoPlay
          loop
          muted
          playsInline
          className="w-[900px] h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Auth;
