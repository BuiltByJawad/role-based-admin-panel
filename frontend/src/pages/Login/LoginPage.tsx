import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { login } from "../../api/authApi";
import { AuthField } from "./components/AuthField";
import { AuthIntro } from "./components/AuthIntro";
import { AuthCard } from "./components/AuthCard";

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
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        if (!trimmedEmail) {
            nextErrors.email = "Email is required.";
        } else if (!validateEmail(trimmedEmail)) {
            nextErrors.email = "Enter a valid email.";
        }
        if (!trimmedPassword) {
            nextErrors.password = "Password is required.";
        }
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        setLoading(true);
        try {
            const result = await login({ email: trimmedEmail, password: trimmedPassword });
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
                <AuthIntro />
                <AuthCard title="Welcome back" description="Sign in with your admin credentials.">
                    {error && (
                        <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                            {error}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <AuthField
                            id="login-email"
                            label="Email"
                            type="email"
                            value={email}
                            error={fieldErrors.email}
                            onChange={(value) => {
                                setEmail(value);
                                if (fieldErrors.email) {
                                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                                }
                            }}
                        />
                        <AuthField
                            id="login-password"
                            label="Password"
                            type="password"
                            value={password}
                            error={fieldErrors.password}
                            onChange={(value) => {
                                setPassword(value);
                                if (fieldErrors.password) {
                                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-brand-500 via-orange-500 to-amber-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </AuthCard>
            </div>
        </div>
    );
};
