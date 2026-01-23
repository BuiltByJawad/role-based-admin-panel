import { memo, useCallback } from "react";
import type { UserItem } from "../../api/usersApi";
import type { UserRole, UserStatus } from "../../store/slices/authSlice";

interface UserTableProps {
    users: UserItem[];
    pendingId: string | null;
    onRoleChange: (user: UserItem, role: UserRole) => void;
    onStatusChange: (user: UserItem, status: UserStatus) => void;
}

interface UserRowProps {
    user: UserItem;
    isPending: boolean;
    onRoleChange: (user: UserItem, role: UserRole) => void;
    onStatusChange: (user: UserItem, status: UserStatus) => void;
}

const UserRow = memo(({ user, isPending, onRoleChange, onStatusChange }: UserRowProps) => {
    const handleRoleChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => onRoleChange(user, e.target.value as UserRole),
        [user, onRoleChange]
    );

    const handleStatusChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => onStatusChange(user, e.target.value as UserStatus),
        [user, onStatusChange]
    );

    return (
        <tr className="text-slate-200">
            <td className="px-4 py-3 font-medium">{user.name}</td>
            <td className="px-4 py-3 text-slate-300">{user.email}</td>
            <td className="px-4 py-3 pr-6">
                <div className="flex justify-start">
                    <div className="relative inline-flex w-full items-center">
                        <select
                            className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 pr-7 text-xs text-slate-200"
                            value={user.role}
                            disabled={isPending}
                            onChange={handleRoleChange}
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="STAFF">STAFF</option>
                        </select>
                        <svg
                            className="pointer-events-none absolute right-2 h-3 w-3 text-slate-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 pr-8">
                <div className="flex justify-start">
                    <div className="relative inline-flex w-full items-center">
                        <select
                            className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 pr-7 text-xs text-slate-200"
                            value={user.status}
                            disabled={isPending}
                            onChange={handleStatusChange}
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                        <svg
                            className="pointer-events-none absolute right-2 h-3 w-3 text-slate-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </div>
                </div>
            </td>
        </tr>
    );
});

UserRow.displayName = "UserRow";

export const UserTable = memo(({ users, pendingId, onRoleChange, onStatusChange }: UserTableProps) => {
    if (users.length === 0) return null;

    return (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
            <table className="min-w-[640px] w-full table-fixed text-left text-sm">
                <colgroup>
                    <col className="w-1/4" />
                    <col className="w-5/12" />
                    <col className="w-1/6" />
                    <col className="w-1/6" />
                </colgroup>
                <thead className="bg-slate-900/80 text-xs uppercase tracking-[0.2em] text-slate-300">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3 pr-8">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {users.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            isPending={pendingId === user.id}
                            onRoleChange={onRoleChange}
                            onStatusChange={onStatusChange}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
});

UserTable.displayName = "UserTable";
