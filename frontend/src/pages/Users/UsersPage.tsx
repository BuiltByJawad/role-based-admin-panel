import { useState, memo, useCallback, useDeferredValue } from "react";
import { useUsers, useUpdateUserRole, useUpdateUserStatus, useOptimisticUserUpdate } from "../../hooks/useUsers";
import type { UserItem } from "../../api/usersApi";
import type { UserRole, UserStatus } from "../../store/slices/authSlice";
import { InviteForm } from "../../components/Users/InviteForm";
import { UserTable } from "../../components/Users/UserTable";
import { Modal } from "../../components/shared/Modal";
import { PaginationFooter } from "../../components/shared/PaginationFooter";

export const UsersPage = memo(() => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [search, setSearch] = useState("");
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const deferredSearch = useDeferredValue(search);

    const { data, isLoading, error } = useUsers(page, limit, deferredSearch || undefined);
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

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 content-transition">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-display text-2xl text-white">User Management</h2>
                    <p className="text-sm text-slate-300">Manage roles and activation state.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <input
                        type="text"
                        placeholder="Search users..."
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
                        onClick={() => setIsInviteOpen(true)}
                    >
                        New Invite
                    </button>
                </div>
            </div>

            <Modal title="Create Invite" isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)}>
                <InviteForm />
            </Modal>

            {isLoading && <p className="mt-6 text-sm text-slate-300">Loading users...</p>}
            {error && (
                <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                    {error instanceof Error ? error.message : "Failed to load users"}
                </p>
            )}
            {!isLoading && !error && users.length === 0 && (
                <p className="mt-6 text-sm text-slate-300">{search ? "No users match your search." : "No users found."}</p>
            )}

            <UserTable users={users} pendingId={pendingId} onRoleChange={handleRoleChange} onStatusChange={handleStatusChange} />

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
