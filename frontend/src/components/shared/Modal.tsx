"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const Modal = ({ title, isOpen, onClose, children }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
            return () => document.body.classList.remove("overflow-hidden");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-6 backdrop-blur-sm dark:bg-slate-950/40">
            <div className="glass-panel-soft max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 text-slate-900 dark:text-slate-100">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl text-slate-900 dark:text-white">{title}</h3>
                    <button
                        type="button"
                        className="rounded-full border border-slate-300/80 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-500/40 dark:bg-transparent dark:text-slate-200 dark:hover:border-sky-300/60 dark:hover:text-white"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>,
        document.body
    );
};