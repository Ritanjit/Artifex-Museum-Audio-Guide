import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { login, signup } from "../../actions/users";
import { useEffect } from "react";
import SamaguriEntrance from "../../assets/samaguri entrance.jpg";
import horai from "../../assets/horai.png";
import vid from "../../assets/majuli1.mp4";
import { useNavigate } from "react-router";
import './auth.css'

const Auth: React.FC = () => {

  const [activeTab, setActiveTab] = useState<"signup" | "login">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // to save email address to local storage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);


  // login handler function
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password ❗");
      return;
    }

    try {
      const res = await login({ email, password });

      if (!res.err || (email==='admin@gmail.com' && password==='123')) {  // or statement for local use --> remove when deploying
        setMessage("Logged in successfully 🎉");

        // save email in browser cache to remember it next time
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Redirect after 2 seconds
        setRedirecting(true); // to show spinner
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setMessage("❌ Login failed! Invalid credentials. ");
      }
    } catch (err) {
      setMessage("Something went wrong. Try again :(");
      console.error("Login Error:", err);
    }
  };

  // sign up handler function
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setMessage("All fields are required ❗");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match ❗");
      return;
    }

    try {
      const res = await signup({ email, password });

      if (!res.err) {
        setMessage("Account created successfully 🎉 You can now log in.");
        setActiveTab("login");
      } else {
        setMessage("❌ Signup failed. Try another email.");
      }
    } catch (err) {
      setMessage("Something went wrong during signup.");
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-stone-100 text-red-950">
      <div className="w-full h-full flex flex-col lg:flex-row-reverse">

        {/* Right Section */}
        <div className="lg:w-1/2 xl:w-5/12 flex flex-col justify-center 
        bg-white shadow-lg h-full pt-10">
          <div className="flex justify-center mb-6">
            <img src={horai} alt="Logo" className="w-20 h-auto" />
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-6 mb-5">
            <button
              onClick={() => setActiveTab("login")}
              className={`py-3 px-12.5 rounded-lg font-semibold text-sm cursor-pointer 
                ${activeTab === "login" ?
                  "bg-red-900 text-white" :
                  "border-2 border-red-900 text-red-900"
                }`}
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-3 px-12.5 rounded-lg font-semibold text-sm cursor-pointer 
                ${activeTab === "signup" ?
                  "bg-red-900 text-white" :
                  "border-2 border-red-900 text-red-900"
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

              {/* Username */}
              {activeTab === "signup" && (
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border border-red-900 rounded-lg p-3 text-sm focus:outline-none"
                />
              )}

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-red-900 rounded-lg p-3 text-sm focus:outline-none"
              />

              {/* password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-red-900 rounded-lg p-3 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ?
                    <FiEye size={18} className="text-red-900" /> :
                    <FiEyeOff size={18} className="text-red-900" />}
                </button>
              </div>

              {/* Confirm Password only for signup */}
              {activeTab === "signup" && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-red-900 rounded-lg p-3 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ?
                      <FiEye size={18} className="text-red-900" /> :
                      <FiEyeOff size={18} className="text-red-900" />}
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  id="remember"
                  className="accent-red-800 sm:mt-1 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>


              <button
                className="bg-red-900 text-white py-3 rounded-lg text-sm w-full 
                hover:bg-red-800 transition-all cursor-pointer"
                onClick={activeTab === "login" ? handleLogin : handleSignup}
              >
                {activeTab === "signup" ? "Let's Start" : "Log In"}
              </button>

              {/* Show Message */}
              {message && (
                <div className="text-sm text-center text-red-900 font-semibold">

                  {message}

                  {redirecting && (
                    <div className="mt-2 flex flex-col items-center">
                      <div className="spinner border-4 border-t-4 border-t-amber-500 border-gray-300 
                      rounded-full w-8 h-8 animate-spin"></div>
                      <p className="text-sm text-gray-500 mt-1">Redirecting to admin page...</p>
                    </div>
                  )}

                </div>
              )}

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
        <div>
          <video
            src={vid}
            autoPlay
            loop
            muted
            playsInline
            className="w-[900px] h-full object-cover fadeIn"
          />
        </div>
      </div>

    </div>
  );
};

export default Auth;
