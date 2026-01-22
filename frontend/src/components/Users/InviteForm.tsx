import { useState, memo, useCallback } from "react";
import { useCreateInvite } from "../../hooks/useInvite";
import type { UserRole } from "../../store/slices/authSlice";

export const InviteForm = memo(() => {
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<UserRole>("STAFF");
    const [inviteStatus, setInviteStatus] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});
    const [copied, setCopied] = useState(false);
    const createInviteMutation = useCreateInvite();

    const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

    const handleInviteSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setInviteStatus(null);
        const nextErrors: { email?: string } = {};
        if (!inviteEmail.trim()) {
            nextErrors.email = "Invite email is required.";
        } else if (!validateEmail(inviteEmail)) {
            nextErrors.email = "Enter a valid email.";
        }
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        createInviteMutation.mutate(
            { email: inviteEmail, role: inviteRole },
            {
                onSuccess: (invite) => {
                    setInviteStatus(`Invite created. Token: ${invite.token}`);
                    setInviteEmail("");
                    setInviteRole("STAFF");
                },
                onError: (err) => {
                    setInviteStatus(err instanceof Error ? err.message : "Failed to create invite");
                },
            }
        );
    }, [inviteEmail, inviteRole, createInviteMutation]);

    const handleCopyToken = useCallback(() => {
        const inviteToken = inviteStatus?.split("Token: ")[1];
        if (inviteToken) {
            navigator.clipboard.writeText(inviteToken);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        }
    }, [inviteStatus]);

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
                    <select
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200"
                        value={inviteRole}
                        onChange={(event) => setInviteRole(event.target.value as UserRole)}
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="STAFF">STAFF</option>
                    </select>
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
                    <button
                        type="button"
                        className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${
                            copied
                                ? "border-emerald-400/60 text-emerald-200 shadow-[0_0_16px_rgba(52,211,153,0.35)]"
                                : "border-amber-400/40 text-amber-200"
                        }`}
                        onClick={handleCopyToken}
                    >
                        {copied ? "Copied" : "Copy Token"}
                    </button>
                </div>
            )}
        </form>
    );
});

InviteForm.displayName = "InviteForm";
