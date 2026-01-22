import { memo, useId } from "react";

interface SelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    disabled?: boolean;
}

export const FormSelect = memo(({
    label,
    value,
    onChange,
    options,
    disabled = false,
}: FormSelectProps) => {
    const id = useId();

    return (
        <div>
            <label htmlFor={id} className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {label}
            </label>
            <select
                id={id}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white disabled:opacity-50"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
});

FormSelect.displayName = "FormSelect";
