import { useState, memo, useCallback } from "react";
import { useCreateInvite } from "../../hooks/useInvite";
import type { UserRole } from "../../store/slices/authSlice";

export const InviteForm = memo(() => {
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<UserRole>("STAFF");
    const [inviteStatus, setInviteStatus] = useState<string | null>(null);
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});
    const [tokenCopied, setTokenCopied] = useState(false);
    const createInviteMutation = useCreateInvite();

    const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

    const handleInviteSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setInviteStatus(null);
        setInviteToken(null);
        const nextErrors: { email?: string } = {};
        const trimmedEmail = inviteEmail.trim();
        if (!trimmedEmail) {
            nextErrors.email = "Invite email is required.";
        } else if (!validateEmail(trimmedEmail)) {
            nextErrors.email = "Enter a valid email.";
        }
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        createInviteMutation.mutate(
            { email: trimmedEmail, role: inviteRole },
            {
                onSuccess: (invite) => {
                    setInviteStatus("Invite created successfully.");
                    setInviteToken(invite.token);
                    setInviteEmail("");
                    setInviteRole("STAFF");
                },
                onError: (err) => {
                    setInviteStatus(err instanceof Error ? err.message : "Failed to create invite");
                },
            }
        );
    }, [inviteEmail, inviteRole, createInviteMutation]);

    const inviteLink = inviteToken && typeof window !== "undefined"
        ? `${window.location.origin}/register?token=${inviteToken}`
        : null;

    const handleCopyToken = useCallback((value: string | null) => {
        if (value) {
            navigator.clipboard.writeText(value);
            setTokenCopied(true);
            window.setTimeout(() => setTokenCopied(false), 1800);
        }
    }, []);


    return (
        <form
            className="mt-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            onSubmit={handleInviteSubmit}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-300">Invite Email</label>
                    <input
                        className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
                            fieldErrors.email
                                ? "border-rose-500/70 focus:border-rose-400"
                                : "border-slate-700/80 focus:border-brand-500/70"
                        }`}
                        value={inviteEmail}
                        onChange={(event) => {
                            setInviteEmail(event.target.value);
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
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-300">Role</label>
                    <div className="relative mt-2">
                        <select
                            className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-10 text-sm text-slate-200"
                            value={inviteRole}
                            onChange={(event) => setInviteRole(event.target.value as UserRole)}
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="STAFF">STAFF</option>
                        </select>
                        <svg
                            className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </div>
                </div>
            </div>
            <button
                type="submit"
                disabled={createInviteMutation.isPending}
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
                {createInviteMutation.isPending ? "Sending..." : "Send Invite"}
            </button>
            {inviteStatus && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-amber-200">
                    <span>{inviteStatus}</span>
                    {inviteToken && (
                        <span className="rounded-full border border-amber-400/30 px-3 py-1 text-xs text-amber-100">
                            {inviteToken}
                        </span>
                    )}
                    {(inviteToken || inviteLink) && (
                        <div className="flex flex-wrap items-center gap-3">
                            {inviteToken && (
                                <button
                                    type="button"
                                    className={`min-w-[132px] rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${
                                        tokenCopied
                                            ? "border-emerald-400/60 text-emerald-200 shadow-[0_0_16px_rgba(52,211,153,0.35)]"
                                            : "border-amber-400/40 text-amber-200"
                                    }`}
                                    onClick={() => handleCopyToken(inviteToken)}
                                >
                                    {tokenCopied ? "Copied" : "Copy Token"}
                                </button>
                            )}
                            {inviteLink && (
                                <a
                                    className="min-w-[132px] rounded-full border border-slate-600 px-3 py-1 text-center text-xs uppercase tracking-[0.2em] text-slate-200 hover:border-slate-400"
                                    href={inviteLink}
                                >
                                    Go to Register
                                </a>
                            )}
                        </div>
                    )}
                </div>
            )}
        </form>
    );
});

InviteForm.displayName = "InviteForm";
