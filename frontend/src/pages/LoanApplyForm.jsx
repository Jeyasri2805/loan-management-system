import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";

const initialState = {
  full_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  aadhaar_number: "",
  pan_number: "",
  employment_type: "",
  loan_type: "",
  monthly_income: "",
  loan_amount: "",
  tenure_months: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  purpose: "",
};

const aadhaarRe = /^\d{12}$/;
const panRe = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const phoneRe = /^[6-9]\d{9}$/;
const pinRe = /^\d{6}$/;

export default function LoanApplyForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "pan_number" ? value.toUpperCase() : value }));
  };

  const validate = () => {
    const required = [
      "full_name", "email", "phone", "date_of_birth", "gender",
      "aadhaar_number", "pan_number", "employment_type", "loan_type",
      "monthly_income", "loan_amount", "tenure_months",
      "address", "city", "state", "pincode",
    ];
    for (const k of required) {
      if (!form[k]) return `Please fill in ${k.replace(/_/g, " ")}`;
    }
    if (!phoneRe.test(form.phone)) return "Invalid phone number";
    if (!aadhaarRe.test(form.aadhaar_number)) return "Aadhaar must be 12 digits";
    if (!panRe.test(form.pan_number)) return "Invalid PAN format (e.g. ABCDE1234F)";
    if (!pinRe.test(form.pincode)) return "Pincode must be 6 digits";
    if (Number(form.loan_amount) <= 0) return "Loan amount must be positive";
    if (Number(form.monthly_income) <= 0) return "Monthly income must be positive";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        monthly_income: Number(form.monthly_income),
        loan_amount: Number(form.loan_amount),
        tenure_months: Number(form.tenure_months),
      };
      await api.post("/loans/", payload);
      toast.success("Application submitted successfully!");
      navigate("/user/loans");
    } catch (e2) {
      const data = e2.response?.data;
      const msg = data ? Object.values(data).flat()[0] : "Submission failed";
      toast.error(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    toast.success("Form reset");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="user" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="card">
          <h2 className="text-2xl font-bold text-slate-800">Apply for a Loan</h2>
          <p className="text-sm text-slate-500">
            Fill in the details below. All fields are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          <Section title="Personal Details" icon="👤">
            <Field label="Full Name">
              <input className="input" name="full_name" value={form.full_name} onChange={handleChange} placeholder="John Doe" />
            </Field>
            <Field label="Email">
              <input type="email" className="input" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </Field>
            <Field label="Phone Number">
              <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
            </Field>
            <Field label="Date of Birth">
              <input type="date" className="input" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
            </Field>
            <Field label="Gender">
              <select className="input" name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
          </Section>

          <Section title="Identity Details" icon="🪪">
            <Field label="Aadhaar Number">
              <input className="input" name="aadhaar_number" value={form.aadhaar_number} onChange={handleChange} placeholder="123412341234" maxLength="12" />
            </Field>
            <Field label="PAN Number">
              <input className="input uppercase" name="pan_number" value={form.pan_number} onChange={handleChange} placeholder="ABCDE1234F" maxLength="10" />
            </Field>
          </Section>

          <Section title="Employment & Loan Details" icon="💼">
            <Field label="Employment Type">
              <select className="input" name="employment_type" value={form.employment_type} onChange={handleChange}>
                <option value="">Select</option>
                <option>Student</option>
                <option>Salaried</option>
                <option>Self-Employed</option>
                <option>Business</option>
                <option>Government Employee</option>
              </select>
            </Field>
            <Field label="Loan Type">
              <select className="input" name="loan_type" value={form.loan_type} onChange={handleChange}>
                <option value="">Select</option>
                <option>Education Loan</option>
                <option>Personal Loan</option>
                <option>Home Loan</option>
                <option>Vehicle Loan</option>
                <option>Business Loan</option>
              </select>
            </Field>
            <Field label="Monthly Income (₹)">
              <input type="number" className="input" name="monthly_income" value={form.monthly_income} onChange={handleChange} placeholder="50000" />
            </Field>
            <Field label="Loan Amount (₹)">
              <input type="number" className="input" name="loan_amount" value={form.loan_amount} onChange={handleChange} placeholder="200000" />
            </Field>
            <Field label="Loan Tenure">
              <select className="input" name="tenure_months" value={form.tenure_months} onChange={handleChange}>
                <option value="">Select</option>
                <option value="6">6 Months</option>
                <option value="12">1 Year</option>
                <option value="24">2 Years</option>
                <option value="60">5 Years</option>
              </select>
            </Field>
          </Section>

          <Section title="Address Details" icon="🏠">
            <Field label="Address" full>
              <input className="input" name="address" value={form.address} onChange={handleChange} placeholder="House / Street" />
            </Field>
            <Field label="City">
              <input className="input" name="city" value={form.city} onChange={handleChange} placeholder="City" />
            </Field>
            <Field label="State">
              <input className="input" name="state" value={form.state} onChange={handleChange} placeholder="State" />
            </Field>
            <Field label="Pincode">
              <input className="input" name="pincode" value={form.pincode} onChange={handleChange} placeholder="600001" maxLength="6" />
            </Field>
          </Section>

          <Section title="Additional Information" icon="📝">
            <Field label="Purpose of Loan" full>
              <textarea
                className="input min-h-[100px]"
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                placeholder="Briefly describe how you intend to use the loan..."
              />
            </Field>
          </Section>

          <div className="flex flex-wrap gap-3 justify-end">
            <button type="button" onClick={handleReset} className="btn-secondary">
              Reset Form
            </button>
            <button disabled={submitting} className="btn-primary">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, full, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
