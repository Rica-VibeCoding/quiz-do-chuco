"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ScribbleButtonProps extends Omit<HTMLMotionProps<"button">, "variant" | "animated"> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "success" | "warning";
    animated?: boolean;
}

export function ScribbleButton({
    children,
    className,
    variant = "primary",
    animated = false,
    ...props
}: ScribbleButtonProps) {
    const colors = {
        primary: "bg-[#3b82f6] text-white hover:bg-[#2563eb] focus-visible:ring-blue-400",
        secondary: "bg-[#a855f7] text-white hover:bg-[#9333ea] focus-visible:ring-purple-400",
        danger: "bg-[#ef4444] text-white hover:bg-[#dc2626] focus-visible:ring-red-400",
        success: "bg-[#22c55e] text-white hover:bg-[#16a34a] focus-visible:ring-green-400",
        warning: "bg-[#fde047] text-black hover:bg-[#facc15] focus-visible:ring-yellow-300",
    };

    const buttonClasses = cn(
        "relative inline-flex items-center justify-center px-4 py-2 md:px-8 md:py-4 font-sans text-lg md:text-2xl font-bold transition-all border-[3px] border-black disabled:opacity-50 disabled:pointer-events-none",
        "rounded-[255px_15px_225px_15px/15px_225px_15px_255px]",
        "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:active:translate-x-[4px] md:active:translate-y-[4px]",
        colors[variant],
        className
    );

    if (animated) {
        return (
            <motion.button
                className={buttonClasses}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    scale: [1, 1.03, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                {...props}
            >
                {children}
            </motion.button>
        );
    }

    return (
        <motion.button
            className={buttonClasses}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}
