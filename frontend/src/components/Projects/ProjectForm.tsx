import { useState, memo, useCallback } from "react";
import { useCreateProject } from "../../hooks/useProjects";

interface ProjectFormProps {
    onError: (message: string) => void;
}

export const ProjectForm = memo(({ onError }: ProjectFormProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; description?: string }>({});
    const createMutation = useCreateProject();

    const handleCreate = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        const nextErrors: { name?: string; description?: string } = {};
        if (!name.trim()) {
            nextErrors.name = "Project name is required.";
        }
        if (!description.trim()) {
            nextErrors.description = "Description is required.";
        }
        setFieldErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            return;
        }
        createMutation.mutate(
            { name, description },
            {
                onSuccess: () => {
                    setName("");
                    setDescription("");
                    setFieldErrors({});
                },
                onError: (err) => {
                    onError(err instanceof Error ? err.message : "Failed to create project");
                },
            }
        );
    }, [name, description, createMutation, onError]);

    return (
        <form onSubmit={handleCreate} className="mt-6 grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Project Name</label>
                    <input
                        className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
                            fieldErrors.name
                                ? "border-rose-500/70 focus:border-rose-400"
                                : "border-slate-700/80 focus:border-brand-500/70"
                        }`}
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            if (fieldErrors.name) {
                                setFieldErrors((prev) => ({ ...prev, name: undefined }));
                            }
                        }}
                    />
                    <p
                        className={`mt-2 min-h-[1rem] text-xs text-rose-200 ${
                            fieldErrors.name ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        {fieldErrors.name ?? " "}
                    </p>
                </div>
                <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Description</label>
                    <input
                        className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
                            fieldErrors.description
                                ? "border-rose-500/70 focus:border-rose-400"
                                : "border-slate-700/80 focus:border-brand-500/70"
                        }`}
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            if (fieldErrors.description) {
                                setFieldErrors((prev) => ({ ...prev, description: undefined }));
                            }
                        }}
                    />
                    <p
                        className={`mt-2 min-h-[1rem] text-xs text-rose-200 ${
                            fieldErrors.description ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        {fieldErrors.description ?? " "}
                    </p>
                </div>
            </div>
            <button
                type="submit"
                disabled={createMutation.isPending}
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
                {createMutation.isPending ? "Creating..." : "New Project"}
            </button>
        </form>
    );
});

ProjectForm.displayName = "ProjectForm";
