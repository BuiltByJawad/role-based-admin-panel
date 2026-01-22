import { useState, memo, useCallback } from "react";
import type { ProjectItem } from "../../api/projectsApi";

interface ProjectCardProps {
    project: ProjectItem;
    isAdmin: boolean;
    pending: boolean;
    onUpdate: (project: ProjectItem, name: string, description: string) => void;
    onStatusChange: (project: ProjectItem, status: "ACTIVE" | "ARCHIVED") => void;
    onDelete: (project: ProjectItem) => void;
}

export const ProjectCard = memo(({
    project,
    isAdmin,
    pending,
    onUpdate,
    onStatusChange,
    onDelete,
}: ProjectCardProps) => {
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
        (e: React.ChangeEvent<HTMLSelectElement>) =>
            onStatusChange(project, e.target.value as "ACTIVE" | "ARCHIVED"),
        [project, onStatusChange]
    );

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-start justify-between">
                <div>
                    {editing ? (
                        <div className="space-y-2">
                            <input
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                                value={editName}
                                onChange={(event) => setEditName(event.target.value)}
                            />
                            <input
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                                value={editDescription}
                                onChange={(event) => setEditDescription(event.target.value)}
                            />
                        </div>
                    ) : (
                        <>
                            <h3 className="font-display text-lg text-white">{project.name}</h3>
                            <p className="mt-1 text-sm text-slate-300">{project.description}</p>
                        </>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    {isAdmin ? (
                        <select
                            className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200"
                            value={project.status}
                            disabled={pending}
                            onChange={handleStatusChange}
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                    ) : (
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">
                            {project.status}
                        </span>
                    )}
                    {isAdmin && (
                        <div className="flex gap-2">
                            {editing ? (
                                <>
                                    <button
                                        className="rounded-full border border-slate-700 px-3 py-1 text-xs"
                                        disabled={pending}
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="rounded-full border border-slate-700 px-3 py-1 text-xs" onClick={startEdit}>
                                        Edit
                                    </button>
                                    <button
                                        className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-200"
                                        disabled={pending}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

ProjectCard.displayName = "ProjectCard";
