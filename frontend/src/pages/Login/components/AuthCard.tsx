import type { ReactNode } from "react";

interface AuthCardProps {
    title: string;
    description: string;
    children: ReactNode;
}

export const AuthCard = ({ title, description, children }: AuthCardProps) => (
    <div className="w-full rounded-3xl border border-slate-200/70 bg-white/85 p-8 text-slate-900 shadow-[0_30px_80px_rgba(148,163,184,0.35)] content-transition backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-[0_30px_80px_rgba(2,6,23,0.6)]">
        <h2 className="font-display text-3xl text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        {children}
    </div>
);

export type { AuthCardProps };
