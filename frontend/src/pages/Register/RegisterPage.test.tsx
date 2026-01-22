import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { RegisterPage } from "./RegisterPage";
import { store } from "../../store/store";

const registerMock = vi.fn(async () => ({
  user: {
    id: "user-1",
    name: "Invited User",
    email: "invited@example.com",
    role: "STAFF",
    status: "ACTIVE",
  },
  token: "test-token",
  refreshToken: "refresh-token",
}));

const navigateMock = vi.fn();

vi.mock("../../api/authApi", () => ({
  registerViaInvite: (...args: Parameters<typeof registerMock>) => registerMock(...args),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderRegister = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </Provider>
  );

describe("RegisterPage", () => {
  it("renders the register form", () => {
    renderRegister();

    expect(screen.getByText("Activate your invite")).toBeInTheDocument();
    expect(screen.getByLabelText("Invite Token")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("submits invite registration", async () => {
    const user = userEvent.setup();

    renderRegister();

    await user.type(screen.getByLabelText("Invite Token"), "token-123");
    await user.type(screen.getByLabelText("Full Name"), "Invited User");
    await user.type(screen.getByLabelText("Password"), "Secure123!");
    await user.click(screen.getByRole("button", { name: "Activate Account" }));

    expect(registerMock).toHaveBeenCalledWith({
      token: "token-123",
      name: "Invited User",
      password: "Secure123!",
    });
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
