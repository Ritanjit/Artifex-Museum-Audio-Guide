import React from "react";
import { MessageCircle } from "lucide-react";

type Props = {
	isOpen: boolean;
	toggleOpen: () => void;
};

const FloatingChatButton = ({ isOpen, toggleOpen }: Props) => {
	return (
		<button
			onClick={toggleOpen}
			className="fixed right-3 top-52 bg-orange-500 hover:bg-orange-600 text-white 
			cursor-pointer p-3 rounded-full shadow-lg z-50"
			title="Ask Me About Majuli"
		>
			<MessageCircle className="w-6 h-6" />
		</button>
	);
};

export default FloatingChatButton;