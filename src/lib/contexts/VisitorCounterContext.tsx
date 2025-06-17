// src\lib\contexts\VisitorCounterContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { getVisitorCount, incrementVisitorCount, updateVisitorHistory } from "@/apis/visitorApi";


interface VisitorContextProps {
    visitorCount: number | null;
}

const VisitorCounterContext = createContext<VisitorContextProps>({
    visitorCount: null
});

export const useVisitorCounter = () => useContext(VisitorCounterContext);

export const VisitorCounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visitorCount, setVisitorCount] = useState<number | null>(null);
    const hasIncremented = useRef(false);

    useEffect(() => {
        const updateCount = async () => {
            try {
                // Check if we've already incremented this session
                if (!sessionStorage.getItem("visitor_incremented")) {
                    const newCount = await incrementVisitorCount();
                    await updateVisitorHistory(); // Update daily history
                    setVisitorCount(newCount);
                    sessionStorage.setItem("visitor_incremented", "true");

                    // Also store in session as fallback
                    sessionStorage.setItem("visitor_count", newCount.toString());
                } else {
                    const count = await getVisitorCount();
                    setVisitorCount(count);
                }
            } catch (error) {
                // ... error handling ...
            }
        };

        if (!hasIncremented.current) {
            hasIncremented.current = true;
            updateCount();
        }
    }, []);

    return (
        <VisitorCounterContext.Provider value={{ visitorCount }}>
            {children}
        </VisitorCounterContext.Provider>
    );
};