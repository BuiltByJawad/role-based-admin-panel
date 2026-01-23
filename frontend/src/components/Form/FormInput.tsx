import { memo, useId } from "react";

interface FormInputProps {
    label: string;
    type?: "text" | "email" | "password";
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
}

export const FormInput = memo(({
    label,
    type = "text",
    value,
    onChange,
    required = false,
    placeholder,
    disabled = false,
}: FormInputProps) => {
    const id = useId();

    return (
        <div>
            <label htmlFor={id} className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                {label}
            </label>
            <input
                id={id}
                type={type}
                className="mt-2 w-full rounded-xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500/70 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
});

FormInput.displayName = "FormInput";
