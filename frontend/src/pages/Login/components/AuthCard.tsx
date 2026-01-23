import type { ReactNode } from "react";

interface AuthCardProps {
    title: string;
    description: string;
    children: ReactNode;
}

export const AuthCard = ({ title, description, children }: AuthCardProps) => (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.6)] content-transition">
        <h2 className="font-display text-3xl text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
        {children}
    </div>
);

export type { AuthCardProps };
