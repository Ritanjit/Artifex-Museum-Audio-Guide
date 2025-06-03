import React, { useState } from "react";
import FloatingChatButton from "./chatbot";

const ChatBotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
        setInput("");
        setIsTyping(true);

        let botResponse = "Sorry, I don't know that yet.";
        const q = userMessage.toLowerCase();

        if (q.includes("majuli")) {
            botResponse = "Majuli is a river island in Assam.";
        } else if (q.includes("mukha")) {
            botResponse = "Mukha is a traditional mask-making art practiced in Majuli.";
        } else if (q.includes("visit")) {
            botResponse = "You can visit Majuli year-round, but winter is ideal.";
        } else if (q.includes("satras")) {
            botResponse = "Satras are monasteries in Majuli that preserve Assamese culture.";
        } else if (q.includes("collections")) {
            botResponse = "Our collections page has artifacts, photos, and masks of Majuli.";
        }

        setTimeout(() => {
            setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button (middle-right) */}
            <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-40">
                <FloatingChatButton isOpen={isOpen} toggleOpen={() => setIsOpen(!isOpen)} />
            </div>

            {/* Chat Window (slightly left of the button) */}
            {isOpen && (
                <div className="fixed top-1/2 right-20 transform -translate-y-1/2 w-[300px] bg-[#0d1117] text-white p-4 rounded-lg shadow-lg border border-[#1b1f2a] z-50">
                    {/* Close (X) Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-[#ff9900] text-lg hover:text-orange-500 font-bold"
                        aria-label="Close chatbot"
                    >
                        ×
                    </button>

                    <h2 className="text-md font-semibold mb-2 text-[#ff9900]">Ask Me About Majuli</h2>

                    <div className="h-[200px] overflow-y-auto space-y-2 mb-3 flex flex-col">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-md max-w-[80%] text-sm ${msg.sender === "user"
                                    ? "bg-[#ff9900] text-black self-end"
                                    : "bg-[#1b1f2a] text-white self-start"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="text-sm italic text-gray-400">Bot is typing...</div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSend();
                            }}
                            placeholder="Type your question..."
                            className="flex-1 px-2 py-1 rounded bg-[#1b1f2a] text-white placeholder-gray-400 border border-[#ff9900]"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-[#ff9900] hover:bg-orange-600 text-black px-3 py-1 rounded"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBotWidget;