// In src/lib/contexts/VisitorCounterContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getVisitorCount, incrementVisitorCount } from "@/apis/visitorApi";

interface VisitorContextProps {
    visitorCount: number | null;
}

const VisitorCounterContext = createContext<VisitorContextProps>({
    visitorCount: null
});

export const useVisitorCounter = () => useContext(VisitorCounterContext);

export const VisitorCounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visitorCount, setVisitorCount] = useState<number | null>(null);

    useEffect(() => {
        const updateCount = async () => {
            try {
                // First increment (if needed)
                if (!sessionStorage.getItem("visitor_incremented")) {
                    await incrementVisitorCount();
                    sessionStorage.setItem("visitor_incremented", "true");
                }

                // Then get updated count
                const count = await getVisitorCount();
                setVisitorCount(count);
            } catch (error) {
                console.error("Visitor counter error:", error);
                // Fallback to local count if API fails
                const localCount = localStorage.getItem("visitor_count_fallback");
                setVisitorCount(localCount ? parseInt(localCount) : 1500);
            }
        };

        updateCount();
    }, []);


    // client-side only solution:
    // useEffect(() => {
    //     const updateCount = async () => {
    //         try {
    //             // Try API first
    //             const hasIncremented = sessionStorage.getItem("visitor_incremented");
    //             let count = 0;

    //             if (!hasIncremented) {
    //                 count = await incrementVisitorCount();
    //                 sessionStorage.setItem("visitor_incremented", "true");
    //             } else {
    //                 count = await getVisitorCount();
    //             }

    //             setVisitorCount(count);
    //         } catch (error) {
    //             console.error("API failed, using fallback:", error);
    //             // Client-side fallback
    //             let count = parseInt(localStorage.getItem("visitor_count") || 1000;
    //             if (!sessionStorage.getItem("visitor_incremented")) {
    //                 count++;
    //                 localStorage.setItem("visitor_count", count.toString());
    //                 sessionStorage.setItem("visitor_incremented", "true");
    //             }
    //             setVisitorCount(count);
    //         }
    //     };

    //     updateCount();
    // }, []);

    return (
        <VisitorCounterContext.Provider value={{ visitorCount }}>
            {children}
        </VisitorCounterContext.Provider>
    );
};