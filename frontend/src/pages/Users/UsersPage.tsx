import { useState, memo, useCallback, useDeferredValue } from "react";
import { useUsers, useUpdateUserRole, useUpdateUserStatus, useOptimisticUserUpdate } from "../../hooks/useUsers";
import type { UserItem } from "../../api/usersApi";
import type { UserRole, UserStatus } from "../../store/slices/authSlice";
import { InviteForm } from "../../components/Users/InviteForm";
import { UserTable } from "../../components/Users/UserTable";
import { Modal } from "../../components/shared/Modal";
import { PaginationFooter } from "../../components/shared/PaginationFooter";
import { PageHeader } from "./components/PageHeader";
import { UsersFeedback } from "./components/UsersFeedback";

export const UsersPage = memo(() => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [search, setSearch] = useState("");
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const deferredSearch = useDeferredValue(search);

    const { data, isLoading, isFetching, error } = useUsers(page, limit, deferredSearch || undefined);
    const updateRoleMutation = useUpdateUserRole();
    const updateStatusMutation = useUpdateUserStatus();
    const { optimisticUpdate } = useOptimisticUserUpdate();

    const users = data?.data ?? [];
    const total = data?.meta?.total ?? 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const pendingId = updateRoleMutation.isPending || updateStatusMutation.isPending
        ? (updateRoleMutation.variables?.userId || updateStatusMutation.variables?.userId || null)
        : null;

    const handleRoleChange = useCallback(async (user: UserItem, nextRole: UserRole) => {
        optimisticUpdate(user.id, { role: nextRole });
        updateRoleMutation.mutate({ userId: user.id, role: nextRole });
    }, [optimisticUpdate, updateRoleMutation]);

    const handleStatusChange = useCallback(async (user: UserItem, nextStatus: UserStatus) => {
        optimisticUpdate(user.id, { status: nextStatus });
        updateStatusMutation.mutate({ userId: user.id, status: nextStatus });
    }, [optimisticUpdate, updateStatusMutation]);

    const errorMessage = error instanceof Error ? error.message : "Failed to load users";

    return (
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-slate-900 shadow-sm shadow-slate-200/60 backdrop-blur content-transition dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:shadow-none">
            <PageHeader
                onInvite={() => setIsInviteOpen(true)}
                search={search}
                onSearchChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
            />

            <Modal title="Create Invite" isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)}>
                <InviteForm />
            </Modal>

            <UsersFeedback
                isLoading={isLoading}
                isFetching={isFetching}
                hasUsers={users.length > 0}
                hasError={!!error}
                search={search}
                errorMessage={errorMessage}
            />

            {!isLoading && (
                <UserTable users={users} pendingId={pendingId} onRoleChange={handleRoleChange} onStatusChange={handleStatusChange} />
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

UsersPage.displayName = "UsersPage";
