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
        primary: "glass-button text-slate-950 hover:brightness-110",
        secondary: "glass-input text-slate-100 hover:border-sky-300/60 hover:text-white",
        danger: "border border-red-500/40 text-red-200 hover:border-red-400/60 hover:bg-red-500/10",
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
