// src\components\visitorCounter\VisitorCounter.tsx
import React from 'react';
import { useVisitorCounter } from '@/lib/contexts/VisitorCounterContext';
import { useLocation } from "react-router-dom";

const VisitorCounter = () => {
    const { visitorCount } = useVisitorCounter();
    const location = useLocation();

    // Hide counter on admin routes
    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4 py-2 
        rounded-full shadow-lg text-sm font-medium text-gray-700 dark:text-gray-200 z-50 flex items-center hidden sm:block">
            <span className="mr-2">👣</span>
            <span>Visitors: </span>
            {visitorCount !== null ? (
                <span className="ml-1">
                    {visitorCount.toLocaleString()}
                </span>
            ) : (
                <span className="ml-1">Loading...</span>
            )}
        </div>
    );
};

export default VisitorCounter;