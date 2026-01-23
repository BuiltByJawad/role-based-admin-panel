import type { ReactNode } from "react";

interface AuthFieldProps {
    id: string;
    label: string;
    type: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

export const AuthField = ({ id, label, type, value, error, onChange }: AuthFieldProps) => (
    <div>
        <label htmlFor={id} className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
            {label}
        </label>
        <input
            id={id}
            className={`mt-2 w-full rounded-xl border bg-white/90 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:bg-slate-950/80 dark:text-white dark:placeholder:text-slate-500 ${
                error
                    ? "border-rose-500/70 focus:border-rose-400"
                    : "border-slate-700/80 focus:border-brand-500/70"
            }`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            type={type}
        />
        <p className={`mt-2 min-h-[1rem] text-xs text-rose-500 dark:text-rose-200 ${error ? "opacity-100" : "opacity-0"}`}>
            {error ?? " "}
        </p>
    </div>
);

export type { AuthFieldProps };
