import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.5-flash'; // You can change this if needed
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export default function GeminiChatWidget() {
    const [showChat, setShowChat] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const chatRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages((prev) => [...prev, `🧑: ${userMessage}`]);
        setInput('');

        try {
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: userMessage }] }],
                generationConfig: {
                    temperature: 0.5,
                },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ],
            });

            const response = result.response.text();
            setMessages((prev) => [...prev, `🤖: ${response}`]);

            setTimeout(() => {
                if (chatRef.current) {
                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                }
            }, 100);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [...prev, `🤖: Sorry, I ran into an issue.`]);
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setShowChat(!showChat)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white 
                p-4 rounded-full shadow-lg transition-all"
            >
                💬
            </button>

            {/* Chat Widget */}
            {showChat && (
                <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl 
                flex flex-col overflow-hidden border border-gray-200">
                    <div className="bg-blue-600 text-white p-4 font-semibold text-lg">Artifex AI Guide</div>

                    <div
                        ref={chatRef}
                        className="flex-1 p-3 overflow-y-auto text-sm space-y-2 h-80"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} className={msg.startsWith('🧑') ? 'text-right' : 'text-left'}>
                                {msg}
                            </div>
                        ))}
                    </div>

                    <div className="flex border-t p-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none"
                            placeholder="Ask me about Majuli..."
                        />
                        <button
                            onClick={handleSend}
                            className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

// import React, { useState, useRef } from 'react';
// import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// const MODEL_NAME = 'gemini-1.5-flash'; // You can change this if needed
// const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// const genAI = new GoogleGenerativeAI(API_KEY);

// const systemPrompt = `
// Nomoskar! 👋 You are an engaging, cheerful, and informative virtual guide for the website Artifex – Museum Audio Guide, a digital space celebrating the vibrant culture, history, and artistry of Majuli, Assam. You're here to make every visitor’s journey insightful and enjoyable.

// Your core responsibilities include helping users:

// - Discover the soul of Majuli – its colorful festivals, rich heritage, traditional crafts, and the spiritual depth of Satras (Vaishnavite monasteries).
// - Explore collections of rare artifacts and manuscripts from Majuli’s Satras, accessible via the Collections page or by scanning QR codes at the museum. Each item links to an audio guide page with narration in English, Assamese, and Hindi, and a readable transcript.
// - Guide visitors to the Visit tab for practical info like museum location, opening hours, and how to use the contact form to reach out.
// - Explain the Feedback section, where guests can rate their visit, share feedback, and complete a fun questionnaire. If passed, they’re awarded a certificate in "History of Majuli Mukha Making".
// - Share details from the Events tab, including upcoming museum events, visitor guidelines, and regulations.

// Tone & Style:
// Keep your responses warm, friendly, and a little playful—like a local guide excited to share Majuli’s magic. Avoid robotic answers—be conversational and helpful.

// Greeting (first-time users):
// “Nomoskar! Welcome to Artifex – your digital guide to the heart of Majuli. Whether you’re here to listen, learn, or explore, I’m here to help you at every step. What would you like to know today?”

// Fallback (when query is unclear):
// “Hmm… I didn’t quite catch that. I mostly know about Majuli’s culture, Satras, artifacts, and museum info. Try asking about one of those—or type ‘help’ to see what I can do!”

// Keep responses human-like, max 100 words.
// `;

// export default function GeminiChatWidget() {
//     const [showChat, setShowChat] = useState(false);
//     const [input, setInput] = useState('');
//     const [messages, setMessages] = useState<string[]>([]);
//     const chatRef = useRef<HTMLDivElement>(null);

//     const handleSend = async () => {
//         if (!input.trim()) return;

//         const userMessage = input;
//         setMessages((prev) => [...prev, `🧑: ${userMessage}`]);
//         setInput('');

//         try {
//             const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
//             const result = await model.generateContent({
//                 contents: [
//                     {
//                         role: 'system',
//                         parts: [{ text: systemPrompt }],
//                     },
//                     {
//                         role: 'user',
//                         parts: [{ text: userMessage }],
//                     },
//                 ],
//                 generationConfig: {
//                     temperature: 0.7,
//                 },
//                 safetySettings: [
//                     { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
//                 ],
//             });


//             const response = result.response.text();
//             setMessages((prev) => [...prev, `🤖: ${response}`]);

//             setTimeout(() => {
//                 if (chatRef.current) {
//                     chatRef.current.scrollTop = chatRef.current.scrollHeight;
//                 }
//             }, 100);
//         } catch (err) {
//             console.error(err);
//             setMessages((prev) => [...prev, `🤖: Sorry, I ran into an issue.`]);
//         }
//     };

//     return (
//         <>
//             {/* Floating Chat Button */}
//             <button
//                 onClick={() => setShowChat(!showChat)}
//                 className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 
//                 rounded-full shadow-lg transition-all"
//             >
//                 💬
//             </button>

//             {/* Chat Widget */}
//             {showChat && (
//                 <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col 
//                 overflow-hidden border border-gray-200">
//                     <div className="bg-blue-600 text-white p-4 font-semibold text-lg">Artifex AI Guide</div>

//                     <div
//                         ref={chatRef}
//                         className="flex-1 p-3 overflow-y-auto text-sm space-y-2 h-80"
//                         style={{ scrollbarWidth: 'thin' }}
//                     >
//                         {messages.map((msg, idx) => (
//                             <div key={idx} className={msg.startsWith('🧑') ? 'text-right' : 'text-left'}>
//                                 {msg}
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex border-t p-2">
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//                             className="flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none"
//                             placeholder="Ask me about Majuli..."
//                         />
//                         <button
//                             onClick={handleSend}
//                             className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
//                         >
//                             Send
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }



