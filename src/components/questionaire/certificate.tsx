import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import img from "../../assets/certificate.jpg"; // high-res image

export default function Certificate() {
    const location = useLocation();
    const navigate = useNavigate();
    const name = location.state?.name || "Participant";

    useEffect(() => {
        if (!location.state?.name) {
            navigate("/");
        }
    }, [location.state, navigate]);

    const handleDownload = async () => {
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [960, 540],
        });

        const bgImage = new Image();
        bgImage.src = img;

        await new Promise((resolve) => {
            bgImage.onload = resolve;
        });

        pdf.addImage(bgImage, "JPEG", 0, 0, 960, 540);

        // Set name position (adjust Y to match visual position)
        pdf.setFont("Times", "bold");
        pdf.setTextColor(255, 191, 0); // amber-like
        pdf.setFontSize(28);

        const nameWidth = pdf.getTextWidth(name);
        const nameX = (960 - nameWidth) / 2;
        const nameY = 290; // adjusted Y position — change this to match design

        pdf.text(name, nameX, nameY);

        // Add date (bottom-left, matching CSS position & amber color)
        pdf.setFontSize(18);
        pdf.setTextColor(255, 191, 0); // RGB for amber-500
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 170, 470);

        pdf.save(`${name.replace(/\s+/g, "_")}_Certificate.pdf`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 dark:bg-gray-950 px-4 py-10 pt-30 gap-6 text-center">

            {/* 🎉 Thank You Header */}
            <div className="mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-red-900 dark:text-amber-400">
                    🎉 Congratulations, {name}!
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mt-2 text-base md:text-lg max-w-xl">
                    Thank you for completing the course. We appreciate your participation and hope you gained valuable insights.
                    Here’s your personalized certificate of completion!
                </p>
            </div>

            {/* Certificate Preview */}
            <div
                className="w-[640px] h-[360px] bg-cover bg-center bg-no-repeat rounded-xl shadow-xl border border-gray-300 dark:border-gray-600"
                style={{ backgroundImage: `url(${img})` }}
            >
                <div className="w-full h-full flex flex-col justify-center items-center relative">
                    <h1 className="text-3xl font-[Times New Roman] font-bold text-amber-500">
                        {name}
                    </h1>
                    <p className="absolute bottom-10 left-28 text-sm text-amber-500 dark:text-gray-300">
                        Date: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 
                cursor-pointer rounded-md transition"
            >
                Download Certificate as PDF
            </button>
        </div>
    );

}
