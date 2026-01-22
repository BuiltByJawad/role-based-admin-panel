import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UsersPage } from "./UsersPage";

vi.mock("../../hooks/useUsers", () => ({
  useUsers: () => ({
    data: {
      data: [
        {
          id: "user-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "ADMIN",
          status: "ACTIVE",
        },
      ],
      meta: { total: 1 },
    },
    isLoading: false,
    error: null,
  }),
  useUpdateUserRole: () => ({
    isPending: false,
    mutate: vi.fn(),
  }),
  useUpdateUserStatus: () => ({
    isPending: false,
    mutate: vi.fn(),
  }),
  useOptimisticUserUpdate: () => ({
    optimisticUpdate: vi.fn(),
  }),
}));

vi.mock("../../components/Users/InviteForm", () => ({
  InviteForm: () => <div>Invite Form</div>,
}));

vi.mock("../../components/Users/UserTable", () => ({
  UserTable: ({ users }: { users: Array<{ id: string; name: string }> }) => (
    <div>
      {users.map((user) => (
        <span key={user.id}>{user.name}</span>
      ))}
    </div>
  ),
}));

describe("UsersPage", () => {
  it("renders user management header and table", () => {
    render(<UsersPage />);

    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Invite Form")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
  });
});
