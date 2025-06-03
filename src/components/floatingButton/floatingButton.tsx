import { useState } from "react";
import { ScanQrCode } from "lucide-react"; // QR Icon
import QRScanner from "../qrScanner/QRScanner";
import { Button } from "../ui/button"; // Consistent button component
import './floatingButton.css'

const FloatingQRButton = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <>
      {/* Floating QR Scanner Button */}
      {/* <div className="fixed bottom-22 right-4 sm:bottom-6 sm:right-8 
        flex flex-col items-center z-50 group bounce-temporary"> */}

        {/* No bouncing button */}
        <div className="fixed bottom-22 right-4 sm:bottom-6 sm:right-8 
        flex flex-col items-center z-50 group cursor-pointer">

        {/* QR Scanner Button */}
        <Button
          onClick={() => setShowScanner(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full
          bg-red-900 hover:bg-red-900 border-1 border-white group-hover:border-amber-500
          dark:bg-gray-950/20 dark:group-hover:bg-gray-950/30 backdrop-blur-lg dark:border-amber-500 
          transition-all group-hover:w-30 hover:group-border-2 hover:group-justify-items-start cursor-pointer"
        >
          <ScanQrCode
            className="text-white group-hover:text-amber-500 dark:text-amber-500 
            h-8 w-8 group-hover:h-30 group-hover:w-30 transition-all"
          />
          <span
            className="hidden group-hover:block transition-all text-amber-500">
            Scan QR
          </span>
        </Button>

        {/* Floating Text Below Button */}
        {/* <span className="mt-1 text-xs sm:text-sm font-semibold text-white group-hover:text-amber-500
        dark:text-amber-500 group-hover:font-bold transform-all group-hover:hidden transition-all">
          Scan QR
        </span> */}
      </div>

      {/* QR Scanner Popup */}
      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}
    </>
  );
};

export default FloatingQRButton;
