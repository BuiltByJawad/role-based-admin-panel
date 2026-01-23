import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerViaInvite } from "../../api/authApi";
import { useAppSelector } from "../../store/hooks";
import { IntroPanel } from "./components/IntroPanel";
import { RegisterCard } from "./components/RegisterCard";

interface FormState {
    token: string;
    name: string;
    password: string;
}

export const RegisterPage = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState<FormState>({ token: "", name: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const inviteToken = searchParams.get("token")?.trim();
        if (!inviteToken) {
            navigate(user ? "/" : "/login", { replace: true });
            return;
        }

        setForm((prev) => ({ ...prev, token: inviteToken }));
    }, [navigate, searchParams, user]);

    const updateField = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (loading) return;
        setError("");
        setSuccess("");

        const trimmed = {
            token: form.token.trim(),
            name: form.name.trim(),
            password: form.password.trim(),
        };

        const newErrors: Record<string, string> = {};
        if (!trimmed.token) newErrors.token = "Invite token is required.";
        if (!trimmed.name) newErrors.name = "Full name is required.";
        if (!trimmed.password) newErrors.password = "Password is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await registerViaInvite(trimmed);
            setSuccess("Registration successful. Redirecting to users...");
            setForm({ token: "", name: "", password: "" });
            setErrors({});
            setTimeout(() => navigate("/users"), 1200);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-6 py-12">
            <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <IntroPanel />
                <RegisterCard
                    form={form}
                    errors={errors}
                    loading={loading}
                    error={error}
                    success={success}
                    onChange={updateField}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};