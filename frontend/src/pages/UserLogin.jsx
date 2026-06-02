import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserLogin() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/user/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to manage your loans"
      side="user"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
          />
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link to="/user/signup" className="text-brand-700 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
      <p className="text-xs text-slate-400 text-center mt-2">
        Are you an admin?{" "}
        <Link to="/admin/login" className="text-brand-700 hover:underline">
          Admin Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({ title, subtitle, side = "user", children }) {
  const isAdmin = side === "admin";
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div
        className={`hidden md:flex flex-col justify-between p-10 text-white bg-gradient-to-br ${
          isAdmin ? "from-slate-800 to-slate-950" : "from-brand-600 to-brand-900"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">L</div>
          <div>
            <div className="font-bold">LoanPro</div>
            <div className="text-xs opacity-80 -mt-0.5">
              {isAdmin ? "Admin Console" : "Customer Portal"}
            </div>
          </div>
        </Link>

        <div>
          <h2 className="text-3xl font-extrabold leading-tight">
            {isAdmin
              ? "Verify, approve & analyse applications with confidence."
              : "Apply, track and manage your loans in one place."}
          </h2>
          <p className="mt-3 opacity-90 max-w-md">
            {isAdmin
              ? "A unified admin dashboard with charts, filters and instant approval."
              : "Live EMI calculator, beautiful dashboards and secure access."}
          </p>
        </div>

        <div className="text-xs opacity-70">
          &copy; {new Date().getFullYear()} LoanPro
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md card">
          <Link to="/" className="text-xs text-brand-700 hover:underline">
            ← Back to home
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">{title}</h1>
          <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
