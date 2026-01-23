import { TableSkeleton } from "../../../components/shared/TableSkeleton";

interface ProjectsFeedbackProps {
    isLoading: boolean;
    isFetching: boolean;
    hasProjects: boolean;
    hasError: boolean;
    search: string;
    errorMessage: string;
}

export const ProjectsFeedback = ({ isLoading, isFetching, hasProjects, hasError, search, errorMessage }: ProjectsFeedbackProps) => (
    <>
        {(isLoading || isFetching) && !hasProjects && <TableSkeleton rows={6} columns={4} />}
        {hasError && (
            <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                {errorMessage}
            </p>
        )}
        {!isLoading && !hasError && !hasProjects && (
            <p className="mt-6 text-sm text-slate-300">
                {search ? "No projects match your search." : "No projects yet."}
            </p>
        )}
    </>
);

export type { ProjectsFeedbackProps };
