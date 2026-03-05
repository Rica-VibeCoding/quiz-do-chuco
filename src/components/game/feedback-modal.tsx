"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScribbleButton } from "@/components/ui/scribble-button";

interface FeedbackModalProps {
    type: "correct" | "wrong" | null;
    message: string;
    onDismiss: () => void;
}

export function FeedbackModal({ type, message, onDismiss }: FeedbackModalProps) {
    if (!type) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                onClick={onDismiss}
            >
                <motion.div
                    initial={{ scale: 0.5, rotate: type === "wrong" ? 180 : 0 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`
                        relative w-full max-w-md p-8 border-[4px] border-black text-center
                        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                        rounded-[5px_225px_15px_255px/255px_15px_225px_15px]
                        ${type === "correct" ? "bg-green-100" : "bg-red-100"}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Character */}
                    <div className="text-7xl mb-4">
                        {type === "correct" ? (
                            <motion.span
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                🎉
                            </motion.span>
                        ) : (
                            <motion.span
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 0.6, repeat: 2 }}
                                className="inline-block"
                                style={{ transform: "scaleY(-1)" }}
                            >
                                🤪
                            </motion.span>
                        )}
                    </div>

                    <h3 className={`text-3xl font-bold mb-4 ${type === "correct" ? "text-green-800" : "text-red-800"}`}>
                        {type === "correct" ? "Acertou!" : "Opa!"}
                    </h3>

                    <p className="text-xl text-zinc-700 mb-6">{message}</p>

                    <ScribbleButton
                        variant={type === "correct" ? "success" : "danger"}
                        onClick={onDismiss}
                        className="text-xl"
                    >
                        {type === "correct" ? "Proxima!" : "Tentar de novo!"}
                    </ScribbleButton>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
