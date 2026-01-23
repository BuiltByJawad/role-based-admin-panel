import { memo, useCallback, useState, useDeferredValue } from "react";
import { useProjects, useUpdateProject, useDeleteProject, useOptimisticProjectUpdate } from "../../hooks/useProjects";
import { useAppSelector } from "../../store/hooks";
import type { ProjectItem } from "../../api/projectsApi";
import { ProjectForm } from "../../components/Projects/ProjectForm";
import { ProjectTable } from "../../components/Projects/ProjectTable";
import { Modal } from "../../components/shared/Modal";
import { PaginationFooter } from "../../components/shared/PaginationFooter";
import { PageHeader } from "./components/PageHeader";
import { ProjectsFeedback } from "./components/ProjectsFeedback";
import { DeleteProjectDialog } from "./components/DeleteProjectDialog";

export const ProjectsPage = memo(() => {
    const role = useAppSelector((state) => state.auth.user?.role);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<ProjectItem | null>(null);

    const { data, isLoading, isFetching, error } = useProjects(page, limit, deferredSearch || undefined);
    const updateMutation = useUpdateProject();
    const deleteMutation = useDeleteProject();
    const { optimisticUpdate, optimisticDelete } = useOptimisticProjectUpdate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const projects = data?.data ?? [];
    const total = data?.meta?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const isAdmin = role === "ADMIN";
    const pendingId = updateMutation.isPending || deleteMutation.isPending
        ? (updateMutation.variables?.id || (deleteMutation.variables as string) || null)
        : null;

    const handleUpdate = useCallback((project: ProjectItem, name: string, description: string) => {
        optimisticUpdate(project.id, { name, description });
        updateMutation.mutate({ id: project.id, data: { name, description } });
    }, [optimisticUpdate, updateMutation]);

    const handleStatusChange = useCallback((project: ProjectItem, status: "ACTIVE" | "ARCHIVED") => {
        optimisticUpdate(project.id, { status });
        updateMutation.mutate({ id: project.id, data: { status } });
    }, [optimisticUpdate, updateMutation]);

    const handleDeleteRequest = useCallback((project: ProjectItem) => {
        setPendingDelete(project);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (!pendingDelete) return;
        optimisticDelete(pendingDelete.id);
        deleteMutation.mutate(pendingDelete.id);
        setPendingDelete(null);
    }, [deleteMutation, optimisticDelete, pendingDelete]);

    const errorMessageText = error instanceof Error ? error.message : errorMessage || "Failed to load projects";

    return (
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-900 shadow-sm shadow-slate-200/60 backdrop-blur content-transition dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:shadow-none">
            <PageHeader
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                onCreate={() => setIsCreateOpen(true)}
            />

            <Modal title="Create Project" isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
                <ProjectForm onError={setErrorMessage} />
            </Modal>

            <DeleteProjectDialog
                projectName={pendingDelete?.name ?? null}
                isOpen={!!pendingDelete}
                onClose={() => setPendingDelete(null)}
                onConfirm={handleDeleteConfirm}
            />

            <ProjectsFeedback
                isLoading={isLoading}
                isFetching={isFetching}
                hasProjects={projects.length > 0}
                hasError={!!error || !!errorMessage}
                search={search}
                errorMessage={errorMessageText}
            />

            {!isLoading && projects.length > 0 && (
                <ProjectTable
                    projects={projects}
                    isAdmin={isAdmin}
                    pendingId={pendingId}
                    onUpdate={handleUpdate}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteRequest}
                />
            )}

            <PaginationFooter
                page={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                isLoading={isLoading}
                onPageChange={setPage}
                onLimitChange={(nextLimit) => {
                    setLimit(nextLimit);
                    setPage(1);
                }}
            />
        </div>
    );
});

ProjectsPage.displayName = "ProjectsPage";
