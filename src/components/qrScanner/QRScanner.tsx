import React, { useState } from "react";
import WebcamCapture from "./WebcamCapture";
import jsQR from "jsqr";

interface QRScannerProps {
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);

  const handleScan = (imageSrc: string | null) => {
    if (imageSrc) {
      decodeQRCode(imageSrc);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          decodeQRCode(reader.result);
        }
      };
    }
  };

  const decodeQRCode = (imageSrc: string) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setQrCode(code.data);
          setIsValidUrl(isValidWebsite(code.data));
          console.log("QR Code:", code.data);
        }
      }
    };
  };

  const isValidWebsite = (text: string): boolean => {
    try {
      const url = new URL(text);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      {/* Modal Container */}
      <div
        className="rounded-2xl p-6 w-full max-w-md relative m-4 shadow-xl border-4
        bg-stone-200 dark:bg-white/5 border-red-900 dark:border-none dark:border-white
        backdrop-blur-lg transition-all duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-900 dark:bg-gray-800 text-white rounded-full w-8 h-8 flex 
            items-center justify-center hover:bg-red-700 dark:hover:bg-red-600 transition"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">QR Scanner</h1>

        {/* Webcam Scanner */}
        <WebcamCapture onScan={handleScan} />

        {/* Upload QR Code Image */}
        <div className="mt-4">
          <label
            htmlFor="qr-upload"
            className="block w-full text-center bg-red-900 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 
            text-white dark:text-white py-1 rounded-lg cursor-pointer hover:bg-amber-600
            dark:hover:bg-gray-700 transition font-medium"
          >
            Upload QR Code
          </label>
          <input
            id="qr-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {/* Display Scanned QR Code */}
        {qrCode && (
          <div className="mt-4 p-3 bg-green-600 text-white rounded-lg text-center">
            <p className="font-medium">Scanned QR Code:</p>
            <span className="font-semibold break-words">{qrCode}</span>
          </div>
        )}

        {/* Redirect Button if it's a valid URL */}
        {isValidUrl && qrCode && (
          <a
            href={qrCode}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-red-900 text-white px-4 py-2 rounded-lg 
            hover:bg-amber-600 transition block text-center font-semibold"
          >
            Visit the Artifact Page!
          </a>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
