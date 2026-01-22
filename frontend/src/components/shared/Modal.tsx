import type { ReactNode } from "react";

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const Modal = ({ title, isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6 py-8 backdrop-blur">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.7)]">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl text-white">{title}</h3>
                    <button
                        type="button"
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200 hover:border-brand-500/60 hover:text-white"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
};
