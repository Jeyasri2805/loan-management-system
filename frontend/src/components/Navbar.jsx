import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ variant = "user" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = variant === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
            L
          </div>
          <div>
            <div className="font-bold text-slate-800">LoanPro</div>
            <div className="text-xs text-slate-500 -mt-1">
              {isAdmin ? "Admin Console" : "Customer Portal"}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
              <NavLink to="/admin/applications">Applications</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/user/dashboard">Dashboard</NavLink>
              <NavLink to="/user/apply">Apply Loan</NavLink>
              <NavLink to="/user/loans">My Loans</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-slate-700">
              {user?.full_name || user?.email}
            </div>
            <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            {(user?.full_name || user?.email || "?").charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} className="btn-secondary !py-2 !px-4 text-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700 transition"
    >
      {children}
    </Link>
  );
}
