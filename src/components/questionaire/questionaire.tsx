import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../lib/contexts/ToastContext";

export default function Questionnaire() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [answers, setAnswers] = useState(Array(10).fill(""));
    const [showResults, setShowResults] = useState(false);

    const handleOptionChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        if (!name.trim() || !email.trim()) {
            showToast("Please fill in both Name and Email before submitting.", "error");
            return;
        }

        // Calculate score
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === correctAnswers[index]) score++;
        });
        const percentage = (score / questions.length) * 100;

        if (percentage >= 50) {
            showToast(`Congratulations! You scored ${percentage.toFixed(0)}% and passed.`, "success");
            // Scroll to top before navigation
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            setTimeout(() => {
                navigate("/certificate", { state: { name, score: percentage } });
            }, 1500);
        } else {
            showToast(`Too many wrong answers (${percentage.toFixed(0)}%). Please try again.`, "error");
            setShowResults(true);
        }
    };

    const getAnswerStatus = (questionIndex: number, option: string) => {
        if (!showResults) return "";

        if (option === correctAnswers[questionIndex])
            return "bg-green-100 border-green-500 dark:bg-green-900/30";

        if (option === answers[questionIndex])
            return "bg-red-100 border-red-500 dark:bg-red-900/30";

        return "";
    };

    const questions = [
        {
            question: "Which river separates Majuli from the mainland of Assam?",
            options: ["Brahmaputra", "Barak", "Manas", "Subansiri"],
        },
        {
            question: "Mukha (masks) from Majuli are primarily associated with which art form?",
            options: ["Bihu Dance", "Sattriya Dance", "Ojapali", "Bhaona"],
        },
        {
            question: "What material is traditionally used to make the base of Majuli Mukha?",
            options: ["Clay", "Wood", "Bamboo and cloth", "Metal"],
        },
        {
            question: "Which Sattras in Majuli are particularly renowned for their Mukha making traditions?",
            options: ["Auniati Satra", "Garmur Satra", "Samaguri Satra", "Dakhinpat Satra"],
        },
        {
            question: "Assamese manuscripts are often written on which unique material?",
            options: ["Palm leaves", "Paper made from bamboo", "Sanchi Pat (bark of the Sanchi tree)", "Cloth"],
        },
        {
            question: "What is the traditional script used for writing Assamese manuscripts?",
            options: ["Devanagari", "Bengali script", "Assamese script (Buranjis style)", "Odia script"],
        },
        {
            question: "Many Assamese manuscripts are preserved in which religious institutions?",
            options: ["Temples", "Mosques", "Sattras", "Gurdwaras"],
        },
        {
            question: "Which of the following is a common theme found in Assamese manuscripts?",
            options: ["Ancient Roman history", "European folklore", "Vaishnavite devotional literature and epics", "Chinese philosophy"],
        },
        {
            question: "The art of Majuli Mukha making is primarily passed down through which method?",
            options: ["Formal university courses", "Apprenticeship within families and Sattras", "Online tutorials", "International workshops"],
        },
        {
            question: "What historical period saw a significant flourishing of Assamese manuscript writing?",
            options: ["Mauryan period", "Gupta period", "Ahom period", "Mughal period"],
        },
    ];

    const correctAnswers = [
        "Brahmaputra",
        "Bhaona",
        "Bamboo and cloth",
        "Samaguri Satra",
        "Sanchi Pat (bark of the Sanchi tree)",
        "Assamese script (Buranjis style)",
        "Sattras",
        "Vaishnavite devotional literature and epics",
        "Apprenticeship within families and Sattras",
        "Ahom period"
    ];

    return (
        <div className="bg-stone-100 dark:bg-gray-950 text-red-900 dark:text-white px-4 sm:px-8 md:px-24 lg:px-40 pt-28 pb-32">
            <h1 className="text-4xl font-bold text-red-900 dark:text-amber-500 mb-4 text-center">
                Audio Guide Certification Quiz
            </h1>
            <p className="text-gray-700 dark:text-gray-400 mb-10 text-center">
                Answer the following questions to unlock your certificate.
            </p>

            <form className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
                {/* Name */}
                <div>
                    <label className="text-sm text-red-900 dark:text-amber-500 mb-2 block">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-md border border-red-200 dark:border-gray-700 bg-white dark:bg-gray-800 
                        text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 focus:border-red-900"
                        placeholder="John Doe"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm text-red-900 dark:text-amber-500 mb-2 block">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-md border border-red-200 dark:border-gray-700 bg-white 
                        dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:ring-red-900 
                        focus:border-red-900"
                        placeholder="example@email.com"
                        required
                    />
                </div>

                {/* Flashcard Questions */}
                {questions.map((q, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 rounded-xl p-6 shadow-md"
                    >
                        <p className="font-semibold text-red-900 dark:text-amber-500 mb-4">
                            {index + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {q.options.map((option, i) => (
                                <label
                                    key={i}
                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer border transition
                                        ${answers[index] === option
                                            ? "border-red-900 dark:bg-amber-500/20 dark:border-amber-500"
                                            : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        } ${getAnswerStatus(index, option)}`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={option}
                                        checked={answers[index] === option}
                                        onChange={() => handleOptionChange(index, option)}
                                        className="accent-red-900 dark:accent-amber-500"
                                    />
                                    <span className="text-sm text-gray-800 dark:text-gray-200">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Submit Button */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-md w-full transition mt-4 cursor-pointer"
                >
                    Submit Questionnaire
                </button>

            </form>
        </div>
    );
}
