import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvite } from "../api/authApi";
import { useAppSelector } from "../store/hooks";
import type { UserRole } from "../store/slices/authSlice";

export const useCreateInvite = () => {
    const token = useAppSelector((state) => state.auth.token);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { email: string; role: UserRole }) =>
            createInvite(data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
};
