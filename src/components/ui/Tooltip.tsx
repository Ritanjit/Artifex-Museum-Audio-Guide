// src/components/ui/Tooltip.tsx
import React from "react";

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    position?: "right" | "left" | "top" | "bottom";
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    position = "right"
}) => {
    const positionClasses = {
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    };

    return (
        <div className="relative group">
            {children}
            <div
                className={`
          absolute ${positionClasses[position]}
          hidden md:group-hover:block
          px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm
          whitespace-nowrap z-50
          before:absolute before:w-2 before:h-2 before:bg-gray-900 before:rotate-45
          ${position === "right"
                        ? "before:-left-1 before:top-1/2 before:-translate-y-1/2"
                        : position === "left"
                            ? "before:-right-1 before:top-1/2 before:-translate-y-1/2"
                            : position === "top"
                                ? "before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2"
                                : "before:top-0 before:left-1/2 before:-translate-x-1/2 before:translate-y-1/2"
                    }
        `}
            >
                {content}
            </div>
        </div>
    );
};