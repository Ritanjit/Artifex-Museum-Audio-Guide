import { useState } from "react";
import { ScanQrCode } from "lucide-react"; // QR Icon
import QRScanner from "../qrScanner/QRScanner";
import { Button } from "../ui/button"; // Consistent button component

const FloatingQRButton = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <>
      {/* Floating QR Scanner Button */}
      <div className="fixed bottom-22 right-4 sm:bottom-6 sm:right-8 
        flex flex-col items-center z-50 group">
        
        {/* QR Scanner Button */}
        <Button
          onClick={() => setShowScanner(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full 
          bg-gray-950/20 hover:bg-gray-950/30 backdrop-blur-lg border border-amber-500 dark:border-amber-500 
          transition-all hover:scale-110 hover:border-2"
        >
          <ScanQrCode
            className="text-amber-500 h-8 w-8 transition-all"
          />
        </Button>

        {/* Floating Text Below Button */}
        <span className="mt-1 text-xs sm:text-sm font-semibold text-amber-500 group-hover:font-bold transform-all">
          Scan QR
        </span>
      </div>

      {/* QR Scanner Popup */}
      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}
    </>
  );
};

export default FloatingQRButton;
