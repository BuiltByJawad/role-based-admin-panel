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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/10 p-6 backdrop-blur-sm">
            <div className="glass-panel-soft w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl text-white">{title}</h3>
                    <button
                        type="button"
                        className="rounded-full border border-slate-500/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-sky-300/60 hover:text-white"
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