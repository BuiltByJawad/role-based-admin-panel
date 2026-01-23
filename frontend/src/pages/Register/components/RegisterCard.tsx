import { InputField } from "./InputField";
import { StatusMessage } from "./StatusMessage";

interface RegisterCardProps {
    form: { token: string; name: string; password: string };
    errors: Record<string, string>;
    loading: boolean;
    error: string;
    success: string;
    onChange: (field: "token" | "name" | "password", value: string) => void;
    onSubmit: (event: React.FormEvent) => void;
}

export const RegisterCard = ({ form, errors, loading, error, success, onChange, onSubmit }: RegisterCardProps) => (
    <div className="w-full rounded-3xl border border-slate-200/70 bg-white/85 p-8 text-slate-900 shadow-[0_30px_80px_rgba(148,163,184,0.35)] content-transition backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-[0_30px_80px_rgba(2,6,23,0.6)]">
        <h2 className="font-display text-3xl text-slate-900 dark:text-white">Activate your invite</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Paste your invite token to finish registration.
        </p>
        {error && <StatusMessage tone="error" message={error} />}
        {success && <StatusMessage tone="success" message={success} />}
        <form onSubmit={onSubmit} className="mt-6 grid gap-5">
            <InputField
                id="register-token"
                label="Invite Token"
                value={form.token}
                error={errors.token}
                disabled={loading || Boolean(success)}
                onChange={(value) => onChange("token", value)}
            />
            <InputField
                id="register-name"
                label="Full Name"
                value={form.name}
                error={errors.name}
                disabled={loading || Boolean(success)}
                onChange={(value) => onChange("name", value)}
            />
            <InputField
                id="register-password"
                label="Password"
                type="password"
                value={form.password}
                error={errors.password}
                disabled={loading || Boolean(success)}
                onChange={(value) => onChange("password", value)}
            />
            <button
                type="submit"
                disabled={loading || Boolean(success)}
                className="rounded-xl bg-gradient-to-r from-brand-500 via-orange-500 to-amber-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Activating..." : "Activate Account"}
            </button>
        </form>
    </div>
);

export type { RegisterCardProps };
