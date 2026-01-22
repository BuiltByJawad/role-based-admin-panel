interface PaginationFooterProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const pageSizes = [20, 50, 100];

export const PaginationFooter = ({
    page,
    totalPages,
    total,
    limit,
    isLoading,
    onPageChange,
    onLimitChange,
}: PaginationFooterProps) => {
    if (totalPages <= 1 && total === 0) return null;

    const visiblePages = Array.from({ length: Math.min(totalPages, 10) }, (_, index) => index + 1);

    return (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span>
                    Page {page} of {Math.max(totalPages, 1)} ({total} records)
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Rows</span>
                    <div className="relative inline-flex items-center">
                        <select
                            className="appearance-none rounded-full border border-slate-700 bg-slate-950 px-3 py-1 pr-8 text-xs text-slate-200"
                            value={limit}
                            onChange={(event) => onLimitChange(Number(event.target.value))}
                        >
                            {pageSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="pointer-events-none absolute right-3 h-3 w-3 text-slate-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <button
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs disabled:opacity-50"
                    disabled={page <= 1 || isLoading}
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                >
                    Previous
                </button>
                {visiblePages.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                            pageNumber === page
                                ? "border-brand-500/60 bg-brand-500/20 text-white"
                                : "border-slate-700 text-slate-300 hover:border-slate-500"
                        }`}
                        disabled={isLoading}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs disabled:opacity-50"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
