import { X } from "lucide-react";
import React, { createContext, useContext, useRef, useState } from "react";

type ToastType = "success" | "error";

interface Toast {
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [visible, setVisible] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = (message: string, type: ToastType = "success") => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setToast({ message, type });
        setVisible(true);
        setAnimationKey(prev => prev + 1);

        timeoutRef.current = setTimeout(() => {
            setVisible(false);
        }, 4000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && toast && (
                <div
                    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-md shadow-xl shadow-black/10 
                        text-sm max-w-sm border-1 border-red-950/20 backdrop-blur-3xl
                    ${toast.type === "success" ?
                            "bg-green-500 text-white" : // Changed from bg-stone-100 to bg-green-500
                            "bg-red-500 text-white"} animate-slide-in`}
                >
                    <div className="flex justify-between items-center gap-4">
                        <span>{toast.message}</span>
                        <button onClick={() => setVisible(false)} className="cursor-pointer">
                            <X size={18} className="hover:text-gray-200" />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/30 rounded-b-md overflow-hidden">
                        <div
                            key={animationKey}
                            className={`h-full ${toast.type === "success" ? "bg-green-700" : "bg-red-700"} animate-progress-bar`}
                        />
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

// // Before using DeepSeek R1
// import { X } from "lucide-react";
// import React, { createContext, useContext, useRef, useState } from "react";

// type ToastType = "success" | "error";

// interface Toast {
//     message: string;
//     type: ToastType;
// }

// interface ToastContextType {
//     showToast: (message: string, type?: ToastType) => void;
// }

// const ToastContext = createContext<ToastContextType | null>(null);

// export const useToast = () => {
//     const context = useContext(ToastContext);
//     if (!context) throw new Error("useToast must be used within a ToastProvider");
//     return context;
// };

// export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [toast, setToast] = useState<Toast | null>(null);
//     const [visible, setVisible] = useState(false);
//     const [animationKey, setAnimationKey] = useState(0); // used to reset animation
//     const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const showToast = (message: string, type: ToastType = "success") => {
//         if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//         }

//         setToast({ message, type });
//         setVisible(true);
//         setAnimationKey(prev => prev + 1); // force progress bar to reset

//         timeoutRef.current = setTimeout(() => {
//             setVisible(false);
//         }, 4000);
//     };

//     return (
//         <ToastContext.Provider value={{ showToast }}>
//             {children}
//             {visible && toast && (
//                 <div
//                     className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-md shadow-xl shadow-black/10 
//                         text-sm max-w-sm border-1 border-red-950/20 backdrop-blur-3xl
//                     ${toast.type === "success" ?
//                             "bg-stone-100 text-red-900" :
//                             "bg-red-500 text-white"} animate-slide-in`}
//                 >
//                     <div className="flex justify-between items-center gap-4">
//                         <span>{toast.message}</span>
//                         <button onClick={() => setVisible(false)} className="cursor-pointer">
//                             <X size={18} className="hover:text-gray-200" />
//                         </button>
//                     </div>
//                     <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/30 rounded-b-md overflow-hidden">
//                         <div
//                             key={animationKey} // this will reset the animation
//                             className="h-full bg-red-900 animate-progress-bar"
//                         />
//                     </div>
//                 </div>
//             )}
//         </ToastContext.Provider>
//     );
// };
