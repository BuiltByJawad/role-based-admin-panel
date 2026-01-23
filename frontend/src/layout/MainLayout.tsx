import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCredentials } from "../store/slices/authSlice";
import { clearAuthState } from "../store/persist";
import { useTheme } from "../hooks/useTheme";

const tabWidth = 110;
const tabGap = 8;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative z-10 flex h-10 w-[110px] items-center justify-center rounded-full text-sm font-semibold transition-colors ${
    isActive ? "text-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
  }`;

export const MainLayout = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Projects", path: "/projects" },
    ...(user?.role === "ADMIN" ? [{ label: "Users", path: "/users" }] : []),
  ];
  const activeIndex = Math.max(
    navItems.findIndex((item) => item.path === location.pathname),
    0
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-4 py-5 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-1">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">RBAC Admin</p>
            <h1 className="font-display text-2xl text-slate-900 dark:text-white">Operations Console</h1>
          </div>
          <nav className="relative mx-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-3xl border border-slate-200/70 bg-white/70 p-2 shadow-[0_0_0_1px_rgba(148,163,184,0.35)] sm:w-auto dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_0_0_1px_rgba(15,23,42,0.4)]">
            <span
              className="absolute left-2 top-2 hidden h-10 w-[110px] rounded-full bg-gradient-to-r from-brand-500 to-amber-400 transition-transform duration-300 ease-out sm:block"
              style={{
                transform: `translateX(${activeIndex * (tabWidth + tabGap)}px)`,
              }}
            />
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-wrap items-center justify-start gap-3 text-sm text-slate-600 md:justify-end dark:text-slate-300">
            {user?.email && <span className="hidden sm:inline">{user.email}</span>}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-brand-500/60 hover:text-slate-900 dark:border-slate-700/80 dark:text-slate-200 dark:hover:text-white"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 12.8A8.5 8.5 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314 1.414 1.414m9.9 9.9 1.414 1.414"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <button
              className="rounded-full border border-slate-300 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-700/80 dark:text-slate-200 dark:hover:border-brand-500/60 dark:hover:text-white"
              onClick={() => {
                dispatch(clearCredentials());
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
