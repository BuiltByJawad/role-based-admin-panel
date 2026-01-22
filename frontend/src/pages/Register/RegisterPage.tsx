import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerViaInvite } from "../../api/authApi";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ token?: string; name?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        const nextErrors: { token?: string; name?: string; password?: string } = {};
        if (!token.trim()) {
            nextErrors.token = "Invite token is required.";
        }
        if (!name.trim()) {
            nextErrors.name = "Full name is required.";
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
            const result = await registerViaInvite({ token, name, password });
            dispatch(setCredentials(result));
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-6 py-12">
            <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="content-transition">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Invite Activation</p>
                    <h2 className="mt-4 font-display text-4xl text-white">Finish your onboarding.</h2>
                    <p className="mt-4 text-base text-slate-200/90">
                        Use the invite token from your admin to activate your account and join the workspace.
                    </p>
                </div>
                <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.6)] content-transition">
                    <h2 className="font-display text-3xl text-white">Activate your invite</h2>
                    <p className="mt-2 text-sm text-slate-300">
                        Paste your invite token to finish registration.
                    </p>
                    {error && (
                        <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                            {error}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                        <div>
                            <label
                                htmlFor="register-token"
                                className="text-xs uppercase tracking-[0.2em] text-slate-300"
                            >
                                Invite Token
                            </label>
                            <input
                                id="register-token"
                                className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
                                    fieldErrors.token
                                        ? "border-rose-500/70 focus:border-rose-400"
                                        : "border-slate-700/80 focus:border-brand-500/70"
                                }`}
                                value={token}
                                onChange={(event) => {
                                    setToken(event.target.value);
                                    if (fieldErrors.token) {
                                        setFieldErrors((prev) => ({ ...prev, token: undefined }));
                                    }
                                }}
                            />
                            <p
                                className={`mt-0.5 h-4 whitespace-nowrap text-xs leading-4 text-rose-200 ${
                                    fieldErrors.token ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                {fieldErrors.token ?? " "}
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="register-name"
                                className="text-xs uppercase tracking-[0.2em] text-slate-300"
                            >
                                Full Name
                            </label>
                            <input
                                id="register-name"
                                className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
                                    fieldErrors.name
                                        ? "border-rose-500/70 focus:border-rose-400"
                                        : "border-slate-700/80 focus:border-brand-500/70"
                                }`}
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                    if (fieldErrors.name) {
                                        setFieldErrors((prev) => ({ ...prev, name: undefined }));
                                    }
                                }}
                            />
                            <p
                                className={`mt-0.5 h-4 whitespace-nowrap text-xs leading-4 text-rose-200 ${
                                    fieldErrors.name ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                {fieldErrors.name ?? " "}
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="register-password"
                                className="text-xs uppercase tracking-[0.2em] text-slate-300"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="register-password"
                                className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
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
                            />
                            <p
                                className={`mt-0.5 h-4 whitespace-nowrap text-xs leading-4 text-rose-200 ${
                                    fieldErrors.password ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                {fieldErrors.password ?? " "}
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-gradient-to-r from-brand-500 via-orange-500 to-amber-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Activating..." : "Activate Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
