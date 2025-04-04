import React, { useState } from "react";
import WebcamCapture from "./WebcamCapture";
import jsQR from "jsqr";

interface QRScannerProps {
  onClose: () => void; // Prop to close the modal
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);

  // Handle QR code scanning from WebcamCapture
  const handleScan = (imageSrc: string | null) => {
    if (imageSrc) {
      decodeQRCode(imageSrc);
    }
  };

  // Handle QR code scanning from uploaded images
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

  // Decode QR code from an image source
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

  // Function to check if the QR code content is a valid URL
  const isValidWebsite = (text: string): boolean => {
    try {
      const url = new URL(text);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {/* Modal Container */}
      <div className="bg-gray-950 text-white rounded-xl shadow-lg p-6 w-full max-w-md relative m-4">
        {/* Close Button */}
<button
  onClick={onClose}
  className="absolute top-3 right-3 bg-gray-800 text-white rounded-full w-8 h-8 flex 
  items-center justify-center hover:bg-red-600 transition"
>
  ✕
</button>


        <h1 className="text-2xl font-bold text-white mb-4 text-center">QR Scanner</h1>

        {/* Webcam Scanner */}
        <WebcamCapture onScan={handleScan} />

        {/* Upload QR Code Image */}
        <div className="mt-4">
          <label
            htmlFor="qr-upload"
            className="block w-full text-center bg-gray-800 border border-gray-600 text-white 
            py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition font-medium"
          >
            Upload QR Code Image
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
            className="mt-4 bg-amber-500 text-black px-4 py-2 rounded-lg 
            hover:bg-amber-600 transition block text-center font-semibold"
          >
            Go to Website
          </a>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
