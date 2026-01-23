import { TableSkeleton } from "../../../components/shared/TableSkeleton";

interface UsersFeedbackProps {
    isLoading: boolean;
    isFetching: boolean;
    hasUsers: boolean;
    hasError: boolean;
    search: string;
    errorMessage: string;
}

export const UsersFeedback = ({ isLoading, isFetching, hasUsers, hasError, search, errorMessage }: UsersFeedbackProps) => (
    <>
        {(isLoading || isFetching) && !hasUsers && <TableSkeleton rows={6} columns={4} />}
        {hasError && (
            <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                {errorMessage}
            </p>
        )}
        {!isLoading && !hasError && !hasUsers && (
            <p className="mt-6 text-sm text-slate-300">
                {search ? "No users match your search." : "No users found."}
            </p>
        )}
    </>
);

export type { UsersFeedbackProps };
