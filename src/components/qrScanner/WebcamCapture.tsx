import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

interface WebcamCaptureProps {
  onScan: (imageSrc: string | null) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onScan }) => {
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      capture();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: "environment",
  };

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onScan(imageSrc);
    }
  };

  return (
    <div className="relative flex flex-col items-center ">
      {/* Webcam Display */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="w-full h-[400px] sm:h-auto rounded-xl border border-gray-700 
        shadow-lg bg-gray-950"
      />

      {/* Capture Button */}
      {/* <button
        onClick={capture}
        className="mt-4 bg-amber-500 text-black px-5 py-2 rounded-lg font-semibold 
        hover:bg-amber-600 transition-all shadow-md"
      >
        Capture QR
      </button> */}
    </div>
  );
};

export default WebcamCapture;
