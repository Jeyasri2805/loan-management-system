import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "./UserLogin.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
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
      await loginAdmin(form.email, form.password);
      toast.success("Welcome, Admin");
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Admin login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Admin Login"
      subtitle="Restricted access — admins only"
      side="admin"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Admin Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input"
            placeholder="admin@loanapp.com"
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
        <button disabled={loading} className="btn-primary w-full bg-slate-800 hover:bg-slate-900">
          {loading ? "Verifying..." : "Login as Admin"}
        </button>
      </form>

      <p className="text-xs text-slate-400 text-center mt-6">
        Not an admin?{" "}
        <Link to="/user/login" className="text-brand-700 hover:underline">
          User Login
        </Link>
      </p>

      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-600 mb-1">Demo credentials</div>
        Email: <span className="font-mono">admin@loanapp.com</span>
        <br />
        Password: <span className="font-mono">admin123</span>
      </div>
    </AuthLayout>
  );
}
