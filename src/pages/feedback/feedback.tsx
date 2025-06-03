import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../lib/contexts/ToastContext"; // ✅ make sure the path is correct

export default function Feedback() {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const { showToast } = useToast(); // ✅ use toast hook

    const handleQuestionnaire = () => {
        navigate("/questionnaire");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ✅ Here you can send data to backend if needed

        showToast("Thank you for your feedback!", "success");
    };

    return (
        <div className="flex flex-col items-center pt-28 pb-32 bg-stone-100 dark:bg-gray-950 text-red-900 dark:text-white px-4 sm:px-8 md:px-24 lg:px-40">
            <h1 className="text-4xl font-bold text-red-900 dark:text-amber-500 mb-4 text-center">
                GIVE US YOUR FEEDBACK
            </h1>
            <p className="text-gray-700 dark:text-gray-400 mb-10 text-center">
                We value your experience at Artifex. Please fill out the form and rate your visit.
            </p>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">

                {/* Left Section */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 rounded-2xl p-8 w-full md:w-1/2 shadow-md"
                >
                    <label className="text-sm text-red-900 dark:text-amber-500 mb-2 block">Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-3 rounded-md mb-4 border border-red-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 focus:border-red-900"
                        required
                    />

                    <label className="text-sm text-red-900 dark:text-amber-500 mb-2 block">Email</label>
                    <input
                        type="email"
                        placeholder="example@email.com"
                        className="w-full p-3 rounded-md mb-4 border border-red-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 focus:border-red-900"
                        required
                    />

                    <label className="text-sm text-red-900 dark:text-amber-500 mb-2 block">Rate Your Experience</label>
                    <div className="flex mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`text-3xl cursor-pointer transition ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <label className="text-sm text-red-900 dark:text-amber-500 mb-2 block">Message (Optional)</label>
                    <textarea
                        placeholder="Your feedback..."
                        className="w-full p-3 rounded-md mb-6 border border-red-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 focus:border-red-900 h-32"
                    ></textarea>

                    <button
                        type="submit"
                        className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-md w-full transition"
                    >
                        Submit Feedback
                    </button>
                </form>

                {/* Right Section */}
                <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 rounded-2xl p-8 w-full md:w-1/2 flex flex-col items-center text-center shadow-md">
                    <h2 className="text-2xl text-red-900 dark:text-amber-500 font-bold mb-4">
                        Earn a Digital Certificate !
                    </h2>
                    <p className="text-gray-700 dark:text-gray-400 mb-6">
                        Get your certificate for the Audio Guided Course on<br/>
                        <span className="italic">
                            History of Majuli Mukha Making
                        </span>
                    </p>

                    <img src="src/assets/certificate_template.jpg" alt="Certificate" className="h-65 mb-6 rounded-xl" />

                    <p className="text-gray-700 dark:text-gray-400 mb-6">
                        To get the certificate, you need to attempt a short questionnaire.
                    </p>

                    <button
                        onClick={handleQuestionnaire}
                        className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 
                    cursor-pointer rounded-md transition"
                    >
                        Attempt Questionnaire
                    </button>
                </div>
            </div>
        </div>
    );
}
