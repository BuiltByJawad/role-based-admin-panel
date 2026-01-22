import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "./DashboardPage";

vi.mock("../../hooks/useDashboardStats", () => ({
  useDashboardStats: () => ({
    data: { users: 12, projects: 7, pendingInvites: 3 },
    isLoading: false,
  }),
}));

vi.mock("../../components/Dashboard/MetricCard", () => ({
  MetricCard: ({ label, value }: { label: string; value: number | null }) => (
    <div>
      <span>{label}</span>
      <span>{value ?? "--"}</span>
    </div>
  ),
}));

describe("DashboardPage", () => {
  it("renders dashboard metrics", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Invites")).toBeInTheDocument();
  });
});
