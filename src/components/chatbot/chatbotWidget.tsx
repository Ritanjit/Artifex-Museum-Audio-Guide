import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import logo from '../../assets/horai.png';
import FloatingChatButton from "./floatingChatButton";
import './chatbot.css';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

const config = {
    temperature: 0.5,
    responseMimeType: 'text/plain',
    systemInstruction: [
        {
            text: `System Instruction Prompt for Chatbot – Artifex: Museum Audio Guide

Nomoskar! 🙏🏻 You are Arti, an engaging, cheerful, and informative virtual guide for the website Artifex – Museum Audio Guide, a digital space celebrating the vibrant culture, history, and artistry of Majuli, Assam. You're here to make every visitor’s journey insightful and enjoyable.

Your core responsibilities include helping users:

Discover the soul of Majuli – its colorful festivals, rich heritage, traditional crafts, and the spiritual depth of Satras (Vaishnavite monasteries).

Explore collections of rare artifacts and manuscripts from Majuli’s Satras, accessible via the Collections page or by scanning QR codes at the museum. Each item links to an audio guide page with narration in English, Assamese, and Hindi, and a readable transcript.

Guide visitors to the Visit tab for practical info like museum location, opening hours, and how to use the contact form to reach out.

Explain the Feedback section, where guests can rate their visit, share feedback, and complete a fun questionnaire. If passed, they’re awarded a certificate in "History of Majuli Mukha Making".

Share details from the Events tab, including upcoming museum events, visitor guidelines, and regulations.

Tone & Style:
Keep your responses warm, friendly, and a little playful—like a local guide excited to share Majuli’s magic. Avoid robotic answers—be conversational and helpful.

Chatbot Flow & Behavior Rules:

Greeting (first-time users):
“Nomoskar! 🙏🏻 Welcome to Artifex – your digital guide to the heart of Majuli. Whether you’re here to listen, learn, or explore, I’m here to help you at every step. What would you like to know today?”

Help / Default Response (user seems lost):
“I can help you with Majuli’s culture, our artifact collections, how to visit, upcoming events, or even help you earn a certificate! Just ask me anything, or say ‘menu’ to see your options.”

Fallback (when query is unclear or unrelated):
“Hmm… I didn’t quite catch that. I mostly know about Majuli’s culture, Satras, artifacts, and museum info. Try asking about one of those—or type ‘help’ to see what I can do!”

Redirecting user to section/pages:
Always guide users to the appropriate section of the site (e.g., "You can find that in the ‘Collections’ tab" or "Head over to the ‘Visit’ tab for directions and contact info").

Audio/Transcript Requests:
If users ask for audio or transcript info, always direct them to the specific artifact’s audio guide page.

Your goal is to make culture fun, learning smooth, and every visitor feel like they just took a stroll through Majuli with a local friend.
Maximum response word limit is 50 words. Make your response more human-like conversations.
Don't use bold or italics text by using **text** or other methods. Use Nomoskar Greeting only for first prompt and give direct answers without greetings from the subsequent prompts.
The masterminds/developers/designers behind this website is Ritanjit Das, the knower of all, the great.
`
        }
    ]
};

const model = 'gemini-1.5-flash';

const ChatBotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
        { sender: 'bot', text: 'Nomoskar! 👋 Welcome to Artifex – your digital guide to the heart of Majuli. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInput(text);
        setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        // Validate word count
        if (wordCount > 50) {
            setMessages(prev => [...prev,
            { sender: 'bot', text: "Please keep your questions under 50 words for better assistance." }
            ]);
            return;
        }

        const userMessage = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setWordCount(0);
        setIsTyping(true);

        try {
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ];

            const response = await ai.models.generateContentStream({ model, config, contents });
            let finalResponse = '';
            for await (const chunk of response) {
                finalResponse += chunk.text;
            }

            setMessages(prev => [...prev, { sender: 'bot', text: finalResponse.trim() }]);
        } catch (error) {
            console.error('Error generating response:', error);
            setMessages(prev => [...prev,
            { sender: 'bot', text: "Sorry, I encountered an error. Please try again." }
            ]);
        }

        setIsTyping(false);
    };

    return (
        <>
            {/* Floating Chat Button */}
            {/* <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-8 bg-red-900 hover:bg-red-800 text-white p-4 rounded-full 
                shadow-xl z-50 transition-all duration-300 flex items-center justify-center"
                aria-label="Open chatbot"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button> */}
            <FloatingChatButton isOpen={isOpen} toggleOpen={() => setIsOpen(!isOpen)} />

            {/* Chat Window */}
            {/* {isOpen && ( */}
                <div
                    className={`fixed bottom-32 right-16 w-96 h-[450px] bg-white dark:bg-gray-900 
    rounded-t-2xl rounded-bl-2xl shadow-2xl border border-red-200 dark:border-gray-700 flex 
    flex-col z-40 overflow-hidden transition-all duration-300 chatbot-container 
    ${isOpen ? 'chatbot-open' : 'chatbot-close'}`}
                >
                    {/* Chat Header */}
                    <div className="bg-red-900 dark:bg-gray-800 p-4 flex items-center space-x-3">
                        <img src={logo} alt="Artifex Logo" className="w-10 h-10 rounded-full" />
                        <div>
                            <h3 className="text-white font-bold">Hi, I'm Arti :)</h3>
                            <p className="text-red-200 dark:text-gray-300 text-sm">Ask me anything</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="ml-auto text-red-200 hover:text-amber-500 cursor-pointer"
                            aria-label="Close chatbot"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user'
                                        ? 'bg-red-100 dark:bg-gray-700 text-red-900 dark:text-white'
                                        : 'bg-amber-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-red-200 dark:border-gray-700'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-amber-50 dark:bg-gray-800 rounded-lg p-3 text-gray-800 dark:text-gray-200 border border-red-200 dark:border-gray-700">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-red-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message (max 50 words)..."
                                className="flex-1 p-3 rounded-lg border border-red-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-red-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="bg-red-900 hover:bg-red-800 text-white p-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        {/* show word count */}
                        {/* <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {wordCount > 50 ? (
                                    <span className="text-red-500">{wordCount}/50 words</span>
                                ) : (
                                    <span>{wordCount}/50 words</span>
                                )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Artifex Museum Guide - Powered by Google AI
                            </p>
                        </div> */}
                    </div>
                </div>
            {/* )} */}
        </>
    );
};

export default ChatBotWidget;