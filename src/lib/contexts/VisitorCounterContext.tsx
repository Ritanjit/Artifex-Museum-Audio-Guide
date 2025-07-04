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
                if (!sessionStorage.getItem("visitor_incremented")) {
                    console.log('Incrementing visitor count...');

                    // Increment main count first
                    const newCount = await incrementVisitorCount();
                    console.log('Main count updated to:', newCount);

                    // Then update history
                    try {
                        console.log('Attempting to update visitor history...');
                        const historyCount = await updateVisitorHistory();
                        console.log('History count updated to:', historyCount);
                    } catch (historyError) {
                        console.error('Failed to update history (will retry):', historyError);
                        // Retry once after short delay
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        try {
                            const retryCount = await updateVisitorHistory();
                            console.log('History update succeeded on retry:', retryCount);
                        } catch (retryError) {
                            console.error('History update failed after retry:', retryError);
                        }
                    }

                    setVisitorCount(newCount);
                    sessionStorage.setItem("visitor_incremented", "true");
                    sessionStorage.setItem("visitor_count", newCount.toString());
                } else {
                    const count = await getVisitorCount();
                    setVisitorCount(count);
                }
            } catch (error) {
                console.error("Error updating visitor count:", error);
                const storedCount = sessionStorage.getItem("visitor_count");
                if (storedCount) {
                    setVisitorCount(Number(storedCount));
                }
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