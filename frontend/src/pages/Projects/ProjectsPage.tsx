import { memo, useCallback, useState, useDeferredValue } from "react";
import { useProjects, useUpdateProject, useDeleteProject, useOptimisticProjectUpdate } from "../../hooks/useProjects";
import { useAppSelector } from "../../store/hooks";
import type { ProjectItem } from "../../api/projectsApi";
import { ProjectForm } from "../../components/Projects/ProjectForm";
import { ProjectTable } from "../../components/Projects/ProjectTable";
import { Modal } from "../../components/shared/Modal";
import { PaginationFooter } from "../../components/shared/PaginationFooter";

export const ProjectsPage = memo(() => {
    const role = useAppSelector((state) => state.auth.user?.role);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data, isLoading, error } = useProjects(page, limit, deferredSearch || undefined);
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

    const handleDelete = useCallback((project: ProjectItem) => {
        optimisticDelete(project.id);
        deleteMutation.mutate(project.id);
    }, [optimisticDelete, deleteMutation]);

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 content-transition">
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
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-400 sm:w-48"
                    />
                    <button
                        type="button"
                        className="w-full rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 sm:w-auto"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        New Project
                    </button>
                </div>
            </div>

            <Modal title="Create Project" isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
                <ProjectForm onError={setErrorMessage} />
            </Modal>

            {isLoading && <p className="mt-6 text-sm text-slate-300">Loading projects...</p>}
            {(error || errorMessage) && (
                <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                    {error instanceof Error ? error.message : errorMessage || "Failed to load projects"}
                </p>
            )}
            {!isLoading && !error && projects.length === 0 && (
                <p className="mt-6 text-sm text-slate-300">{search ? "No projects match your search." : "No projects yet."}</p>
            )}

            {projects.length > 0 && (
                <ProjectTable
                    projects={projects}
                    isAdmin={isAdmin}
                    pendingId={pendingId}
                    onUpdate={handleUpdate}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
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
