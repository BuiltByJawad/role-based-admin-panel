import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, updateUserRole, updateUserStatus, type UserItem } from "../api/usersApi";
import { useAppSelector } from "../store/hooks";
import type { UserRole, UserStatus } from "../store/slices/authSlice";

export const useUsers = (page: number, limit: number, search?: string) => {
    const token = useAppSelector((state) => state.auth.token);

    return useQuery({
        queryKey: ["users", page, limit, search],
        queryFn: () => fetchUsers(token!, page, limit, search),
        enabled: !!token,
        staleTime: 1000 * 60 * 2,
        placeholderData: keepPreviousData,
    });
};

export const useUpdateUserRole = () => {
    const token = useAppSelector((state) => state.auth.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
            updateUserRole(token!, userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};

export const useUpdateUserStatus = () => {
    const token = useAppSelector((state) => state.auth.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
            updateUserStatus(token!, userId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};

export const useOptimisticUserUpdate = () => {
    const queryClient = useQueryClient();

    const optimisticUpdate = (userId: string, updates: Partial<UserItem>) => {
        queryClient.setQueriesData<{ data: UserItem[]; meta: { total: number } }>(
            { queryKey: ["users"] },
            (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((user) =>
                        user.id === userId ? { ...user, ...updates } : user
                    ),
                };
            }
        );
    };

    return { optimisticUpdate };
};
