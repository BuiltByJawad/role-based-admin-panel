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
    const baseClasses = "rounded-xl py-3 px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

    const variantClasses = {
        primary: "bg-brand-500 text-white hover:bg-brand-600",
        secondary: "border border-slate-700 text-slate-200 hover:bg-slate-800",
        danger: "border border-red-500/40 text-red-200 hover:bg-red-500/10",
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
