import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCredentials } from "../store/slices/authSlice";

const tabWidth = 110;
const tabGap = 8;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative z-10 flex h-10 w-[110px] items-center justify-center rounded-full text-sm font-medium transition-colors ${
    isActive ? "text-white" : "text-slate-300 hover:text-white"
  }`;

export const MainLayout = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
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
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-4 py-5 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-1">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-slate-400">RBAC Admin</p>
            <h1 className="font-display text-2xl text-white">Operations Console</h1>
          </div>
          <nav className="relative mx-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-2 shadow-[0_0_0_1px_rgba(15,23,42,0.4)] sm:w-auto">
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
          <div className="flex flex-wrap items-center justify-start gap-3 text-sm text-slate-300 md:justify-end">
            {user?.email && <span className="hidden sm:inline">{user.email}</span>}
            <button
              className="rounded-full border border-slate-700/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 hover:border-brand-500/60 hover:text-white"
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
