interface StatusMessageProps {
    tone: "error" | "success";
    message: string;
}

export const StatusMessage = ({ tone, message }: StatusMessageProps) => (
    <p
        className={`mt-4 rounded-xl border px-4 py-2 text-sm ${
            tone === "error"
                ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-200"
                : "border-emerald-400/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-100"
        }`}
    >
        {message}
    </p>
);

export type { StatusMessageProps };
