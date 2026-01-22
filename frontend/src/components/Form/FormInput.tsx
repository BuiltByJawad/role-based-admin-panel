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
            <label htmlFor={id} className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {label}
            </label>
            <input
                id={id}
                type={type}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 disabled:opacity-50"
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
