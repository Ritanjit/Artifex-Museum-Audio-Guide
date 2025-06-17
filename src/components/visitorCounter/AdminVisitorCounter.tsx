// src/components/visitorCounter/AdminVisitorCounter.tsx
import React, { useRef } from 'react';
import { useVisitorCounter } from '@/lib/contexts/VisitorCounterContext';
import { UsersIcon, UsersIconHandle } from '@/components/ui/users';

const AdminVisitorCounter = () => {
    const { visitorCount } = useVisitorCounter();
    const usersIconRef = useRef<UsersIconHandle>(null);

    const handleMouseEnter = () => {
        usersIconRef.current?.startAnimation();
    };

    const handleMouseLeave = () => {
        usersIconRef.current?.stopAnimation();
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="bottom-4 left-4 bg-white/90 dark:bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-md font-medium text-gray-700 dark:text-gray-200 z-50 flex items-center justify-center transition-transform duration-300 transform hover:scale-105"
        >
            <span className="mr-2">
                <UsersIcon ref={usersIconRef} size={20} />
            </span>
            <span>Visitors:</span>
            {visitorCount !== null ? (
                <span className="ml-2">{visitorCount.toLocaleString()}</span>
            ) : (
                <span className="ml-2">Loading...</span>
            )}
        </div>
    );
};

export default AdminVisitorCounter;

