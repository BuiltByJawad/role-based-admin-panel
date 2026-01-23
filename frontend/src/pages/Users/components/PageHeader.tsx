interface PageHeaderProps {
    onInvite: () => void;
    search: string;
    onSearchChange: (value: string) => void;
}

export const PageHeader = ({ onInvite, search, onSearchChange }: PageHeaderProps) => (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
            <h2 className="font-display text-2xl text-white">User Management</h2>
            <p className="text-sm text-slate-300">Manage roles and activation state.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-400 sm:w-48"
            />
            <button
                type="button"
                className="w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 sm:w-auto"
                onClick={onInvite}
            >
                New Invite
            </button>
        </div>
    </div>
);

export type { PageHeaderProps };
