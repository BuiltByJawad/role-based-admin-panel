import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    type ProjectItem,
    type ProjectsResponse,
} from "../api/projectsApi";
import { useAppSelector } from "../store/hooks";

export const useProjects = (page: number, limit: number, search?: string) => {
    const token = useAppSelector((state) => state.auth.token);

    return useQuery({
        queryKey: ["projects", page, limit, search],
        queryFn: () => fetchProjects(token!, page, limit, search),
        enabled: !!token,
        staleTime: 1000 * 60 * 2,
    });
};

export const useCreateProject = () => {
    const token = useAppSelector((state) => state.auth.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name: string; description: string }) =>
            createProject(token!, data),
        onSuccess: (newProject) => {
            const existingQueries = queryClient.getQueriesData<ProjectsResponse>({ queryKey: ["projects"] });

            existingQueries.forEach(([key, data]) => {
                if (!data) return;
                const searchKey = String((key as (string | undefined)[])[3] ?? "").toLowerCase();
                const matchesSearch = !searchKey
                    || newProject.name.toLowerCase().includes(searchKey)
                    || newProject.description.toLowerCase().includes(searchKey);

                if (!matchesSearch) return;

                queryClient.setQueryData<ProjectsResponse>(key, {
                    ...data,
                    data: [newProject, ...data.data],
                    meta: {
                        ...data.meta,
                        total: data.meta.total + 1,
                    },
                });
            });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};

export const useUpdateProject = () => {
    const token = useAppSelector((state) => state.auth.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: { name?: string; description?: string; status?: "ACTIVE" | "ARCHIVED" };
        }) => updateProject(token!, id, data),
        onSuccess: (updatedProject) => {
            queryClient.setQueriesData<ProjectsResponse>({ queryKey: ["projects"] }, (old) =>
                old
                    ? {
                        ...old,
                        data: old.data.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
                    }
                    : old
            );
        },
    });
};

export const useDeleteProject = () => {
    const token = useAppSelector((state) => state.auth.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProject(token!, id),
        onSuccess: (_data, id) => {
            queryClient.setQueriesData<ProjectsResponse>({ queryKey: ["projects"] }, (old) =>
                old
                    ? {
                        ...old,
                        data: old.data.filter((p) => p.id !== id),
                        meta: {
                            ...old.meta,
                            total: Math.max(old.meta.total - 1, 0),
                        },
                    }
                    : old
            );
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};

export const useOptimisticProjectUpdate = () => {
    const queryClient = useQueryClient();

    const optimisticUpdate = (projectId: string, updates: Partial<ProjectItem>) => {
        queryClient.setQueriesData<ProjectsResponse>({ queryKey: ["projects"] }, (old) =>
            old
                ? {
                    ...old,
                    data: old.data.map((p) => (p.id === projectId ? { ...p, ...updates } : p)),
                }
                : old
        );
    };

    const optimisticDelete = (projectId: string) => {
        queryClient.setQueriesData<ProjectsResponse>({ queryKey: ["projects"] }, (old) =>
            old
                ? {
                    ...old,
                    data: old.data.filter((p) => p.id !== projectId),
                    meta: {
                        ...old.meta,
                        total: Math.max(old.meta.total - 1, 0),
                    },
                }
                : old
        );
    };

    return { optimisticUpdate, optimisticDelete };
};
