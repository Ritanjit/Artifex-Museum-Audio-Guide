import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import '../floatingButton/floatingButton.css';

const FloatingChatButton = ({ isOpen, toggleOpen }: { isOpen: boolean; toggleOpen: () => void }) => {
    return (
        <div className="fixed bottom-24 right-8 z-50 group cursor-pointer">
            {/* Chat Button */}
            <Button
                onClick={toggleOpen}
                className="w-14 h-14 flex items-center justify-center rounded-full
        bg-red-900 hover:bg-red-900 border-1 border-white group-hover:border-amber-500
        dark:bg-gray-950/20 dark:group-hover:bg-gray-950/30 backdrop-blur-lg dark:border-amber-500 
        transition-all group-hover:w-30 hover:group-border-2 hover:group-justify-items-start
        shadow-xl cursor-pointer"
                aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
            >
                {isOpen ? (
                    <X className="text-white group-hover:text-amber-500 dark:text-amber-500 
            h-6 w-6 transition-all" />
                ) : (
                    <MessageCircle className="text-white group-hover:text-amber-500 dark:text-amber-500 
            h-6 w-6 transition-all" />
                )}
                <span className="hidden group-hover:block transition-all text-amber-500">
                    {isOpen ? "Close" : "Chat"}
                </span>
            </Button>
        </div>
    );
};

export default FloatingChatButton;