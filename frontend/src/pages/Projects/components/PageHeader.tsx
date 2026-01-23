interface PageHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onCreate: () => void;
}

export const PageHeader = ({ search, onSearchChange, onCreate }: PageHeaderProps) => (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
            <h2 className="font-display text-2xl text-white">Projects</h2>
            <p className="text-sm text-slate-300">Create and track initiatives.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-400 sm:w-48"
            />
            <button
                type="button"
                className="w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 sm:w-auto"
                onClick={onCreate}
            >
                New Project
            </button>
        </div>
    </div>
);

export type { PageHeaderProps };
