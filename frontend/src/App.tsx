import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { UsersPage } from "./pages/Users/UsersPage";
import { ProjectsPage } from "./pages/Projects/ProjectsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAppSelector } from "./store/hooks";
import { useTheme } from "./hooks/useTheme";

const AuthenticatedLayout = () => {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};

const LoginRedirect = () => {
  const token = useAppSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
};

const RegisterRedirect = () => {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();
  const inviteToken = new URLSearchParams(location.search).get("token");

  if (token && !inviteToken) {
    return <Navigate to="/" replace />;
  }

  return <RegisterPage />;
};

export const App = () => {
  useTheme();

  return (
    <Routes>
      <Route path="/" element={<AuthenticatedLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/register" element={<RegisterRedirect />} />
    </Routes>
  );
};
