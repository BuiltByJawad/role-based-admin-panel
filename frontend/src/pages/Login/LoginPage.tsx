import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { login } from "../../api/authApi";

export const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        const nextErrors: { email?: string; password?: string } = {};
        if (!email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!validateEmail(email)) {
            nextErrors.email = "Enter a valid email.";
        }
        if (!password.trim()) {
            nextErrors.password = "Password is required.";
        }
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            const result = await login({ email, password });
            dispatch(setCredentials(result));
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-6 py-12">
            <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="content-transition">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Operations Suite</p>
                    <h2 className="mt-4 font-display text-4xl text-white">Command your workspace.</h2>
                    <p className="mt-4 text-base text-slate-200/90">
                        Authenticate to manage invites, projects, and team access. Everything stays centralized,
                        auditable, and fast.
                    </p>
                </div>
                <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.6)] content-transition">
                    <h2 className="font-display text-3xl text-white">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-300">Sign in with your admin credentials.</p>
                    {error && (
                        <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                            {error}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label
                                htmlFor="login-email"
                                className="text-xs uppercase tracking-[0.2em] text-slate-300"
                            >
                                Email
                            </label>
                            <input
                                id="login-email"
                                className={`mt-2 w-full rounded-xl border bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none ${
                                    fieldErrors.email
                                        ? "border-rose-500/70 focus:border-rose-400"
                                        : "border-slate-700/80 focus:border-brand-500/70"
                                }`}
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    if (fieldErrors.email) {
                                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                                    }
                                }}
                                type="email"
                            />
                            <p
                                className={`mt-2 min-h-[1rem] text-xs text-rose-200 ${
                                    fieldErrors.email ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                {fieldErrors.email ?? " "}
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="login-password"
                                className="text-xs uppercase tracking-[0.2em] text-slate-300"
                            >
                                Password
                            </label>
                            <input
                                id="login-password"
                                className={`mt-2 w-full rounded-xl border bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none ${
                                    fieldErrors.password
                                        ? "border-rose-500/70 focus:border-rose-400"
                                        : "border-slate-700/80 focus:border-brand-500/70"
                                }`}
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    if (fieldErrors.password) {
                                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                                    }
                                }}
                                type="password"
                            />
                            <p
                                className={`mt-2 min-h-[1rem] text-xs text-rose-200 ${
                                    fieldErrors.password ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                {fieldErrors.password ?? " "}
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-brand-500 via-orange-500 to-amber-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
