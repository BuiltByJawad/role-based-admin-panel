import { memo } from "react";

interface FormButtonProps {
    type?: "submit" | "button";
    loading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
}

export const FormButton = memo(({
    type = "submit",
    loading = false,
    loadingText = "Loading...",
    children,
    onClick,
    variant = "primary",
    disabled = false,
}: FormButtonProps) => {
    const baseClasses = "rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60";

    const variantClasses = {
        primary: "bg-gradient-to-r from-brand-500 via-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/20 hover:brightness-110",
        secondary: "border border-slate-300 bg-white/80 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-200",
        danger: "border border-red-500/40 text-red-500 hover:border-red-400/60 hover:bg-red-500/10 dark:text-red-200",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {loading ? loadingText : children}
        </button>
    );
});

FormButton.displayName = "FormButton";
