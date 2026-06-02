import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "./UserLogin.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const phoneRe = /^[6-9]\d{9}$/;

export default function UserSignup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.full_name.trim()) return "Full name is required";
    if (!form.email.trim()) return "Email is required";
    if (!phoneRe.test(form.phone)) return "Enter a valid 10-digit phone number";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirm_password) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created successfully!");
      navigate("/user/dashboard");
    } catch (e2) {
      const data = e2.response?.data;
      const msg =
        (data && (Object.values(data).flat()[0] || data.detail)) ||
        "Signup failed";
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join LoanPro in seconds"
      side="user"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label">Full Name</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} className="input" placeholder="John Doe" />
        </div>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="9876543210" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="input" placeholder="••••••••" />
          </div>
          <div>
            <label className="label">Confirm</label>
            <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} className="input" placeholder="••••••••" />
          </div>
        </div>
        <button disabled={loading} className="btn-primary w-full mt-2">
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-6">
        Already have an account?{" "}
        <Link to="/user/login" className="text-brand-700 font-semibold hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
