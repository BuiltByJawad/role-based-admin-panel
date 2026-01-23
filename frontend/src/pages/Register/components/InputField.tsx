interface InputFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

export const InputField = ({ id, label, type = "text", value, error, onChange }: InputFieldProps) => (
    <div>
        <label htmlFor={id} className="text-xs uppercase tracking-[0.2em] text-slate-300">
            {label}
        </label>
        <input
            id={id}
            type={type}
            className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
                error
                    ? "border-rose-500/70 focus:border-rose-400"
                    : "border-slate-700/80 focus:border-brand-500/70"
            }`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
        />
        <p className={`mt-0.5 h-4 whitespace-nowrap text-xs leading-4 text-rose-200 ${error ? "opacity-100" : "opacity-0"}`}>
            {error ?? " "}
        </p>
    </div>
);

export type { InputFieldProps };
