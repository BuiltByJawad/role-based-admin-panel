import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { store } from "../../store/store";

const loginMock = vi.fn(async () => ({
  user: {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    status: "ACTIVE",
  },
  token: "test-token",
  refreshToken: "refresh-token",
}));

const navigateMock = vi.fn();

vi.mock("../../api/authApi", () => ({
  login: (...args: Parameters<typeof loginMock>) => loginMock(...args),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderLogin = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );

describe("LoginPage", () => {
  it("renders the login form", () => {
    renderLogin();

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("submits credentials", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "Admin123!");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(loginMock).toHaveBeenCalledWith({ email: "admin@example.com", password: "Admin123!" });
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
