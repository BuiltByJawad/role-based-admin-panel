import { memo, useCallback, useState } from "react";
import type { ProjectItem } from "../../api/projectsApi";

interface ProjectTableProps {
    projects: ProjectItem[];
    isAdmin: boolean;
    pendingId: string | null;
    onUpdate: (project: ProjectItem, name: string, description: string) => void;
    onStatusChange: (project: ProjectItem, status: "ACTIVE" | "ARCHIVED") => void;
    onDelete: (project: ProjectItem) => void;
}

interface ProjectRowProps {
    project: ProjectItem;
    isAdmin: boolean;
    isPending: boolean;
    onUpdate: (project: ProjectItem, name: string, description: string) => void;
    onStatusChange: (project: ProjectItem, status: "ACTIVE" | "ARCHIVED") => void;
    onDelete: (project: ProjectItem) => void;
}

const ProjectRow = memo(({
    project,
    isAdmin,
    isPending,
    onUpdate,
    onStatusChange,
    onDelete,
}: ProjectRowProps) => {
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(project.name);
    const [editDescription, setEditDescription] = useState(project.description);

    const startEdit = useCallback(() => {
        setEditing(true);
        setEditName(project.name);
        setEditDescription(project.description);
    }, [project.name, project.description]);

    const handleSave = useCallback(() => {
        onUpdate(project, editName, editDescription);
        setEditing(false);
    }, [project, editName, editDescription, onUpdate]);

    const handleCancel = useCallback(() => setEditing(false), []);
    const handleDelete = useCallback(() => onDelete(project), [project, onDelete]);
    const handleStatusChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) =>
            onStatusChange(project, event.target.value as "ACTIVE" | "ARCHIVED"),
        [project, onStatusChange]
    );

    return (
        <tr className="text-[0.95rem] text-slate-700 dark:text-slate-200">
            <td className="px-4 py-3 pr-6">
                {editing ? (
                    <input
                        className="w-full rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                    />
                ) : (
                    <span className="font-medium text-slate-900 dark:text-white">{project.name}</span>
                )}
            </td>
            <td className="px-4 py-3">
                {editing ? (
                    <input
                        className="w-full rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                    />
                ) : (
                    <span className="text-slate-600 dark:text-slate-300">{project.description}</span>
                )}
            </td>
            <td className="px-4 py-3">
                <div className="flex justify-start">
                    {isAdmin ? (
                        <div className="relative inline-flex items-center">
                            <select
                                className="appearance-none rounded-full border border-slate-200 bg-white/95 px-3 py-2 pr-8 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                value={project.status}
                                disabled={isPending}
                                onChange={handleStatusChange}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="ARCHIVED">ARCHIVED</option>
                            </select>
                            <svg
                                className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                        </div>
                    ) : (
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-200">
                            {project.status}
                        </span>
                    )}
                </div>
            </td>
            {isAdmin && (
                <td className="px-4 py-3 pr-6">
                    <div className="flex flex-nowrap items-center justify-start gap-2">
                        {editing ? (
                            <>
                                <button
                                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-200"
                                    disabled={isPending}
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-200"
                                    disabled={isPending}
                                    onClick={startEdit}
                                >
                                    Edit
                                </button>
                                <button
                                    className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-500 dark:text-red-200"
                                    disabled={isPending}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </td>
            )}
        </tr>
    );
});

ProjectRow.displayName = "ProjectRow";

export const ProjectTable = memo(({
    projects,
    isAdmin,
    pendingId,
    onUpdate,
    onStatusChange,
    onDelete,
}: ProjectTableProps) => {
    if (projects.length === 0) return null;

    return (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/85 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
            <table className="w-full min-w-[720px] table-fixed text-left text-[0.95rem]">
                <colgroup>
                    <col className="w-1/4" />
                    <col className="w-1/2" />
                    <col className={isAdmin ? "w-1/6" : "w-1/4"} />
                    {isAdmin && <col className="w-1/6" />}
                </colgroup>
                <thead className="bg-slate-100/90 text-[0.65rem] uppercase tracking-[0.22em] text-slate-600 dark:bg-slate-900/80 dark:text-slate-300">
                    <tr>
                        <th className="px-4 py-3 text-slate-600 dark:text-slate-300">Name</th>
                        <th className="px-4 py-3 text-slate-600 dark:text-slate-300">Description</th>
                        <th className="px-4 py-3 pr-6 text-slate-600 dark:text-slate-300">Status</th>
                        {isAdmin && <th className="px-4 py-3 pr-6 text-slate-600 dark:text-slate-300">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                    {projects.map((project) => (
                        <ProjectRow
                            key={project.id}
                            project={project}
                            isAdmin={isAdmin}
                            isPending={pendingId === project.id}
                            onUpdate={onUpdate}
                            onStatusChange={onStatusChange}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
});

ProjectTable.displayName = "ProjectTable";
