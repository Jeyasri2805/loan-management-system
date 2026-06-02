import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const STATUSES = ["Pending", "Approved", "Rejected"];

export default function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLoan = () => {
    setLoading(true);
    api
      .get(`/loans/admin/${id}/`)
      .then((r) => setLoan(r.data))
      .catch(() => {
        toast.error("Loan not found");
        navigate("/admin/applications");
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchLoan, [id]);

  const updateStatus = async (status) => {
    try {
      await api.patch(`/loans/admin/${id}/status/`, { status });
      toast.success(`Status updated to ${status}`);
      fetchLoan();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading || !loan) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar variant="admin" />
        <main className="max-w-5xl mx-auto px-4 py-10 text-center text-slate-500">
          Loading application...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="admin" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <Link to="/admin/applications" className="text-sm text-brand-700 hover:underline">
          ← Back to Applications
        </Link>

        <div className="card">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm text-slate-500">Application #{loan.id}</div>
              <h2 className="text-2xl font-bold text-slate-800">{loan.full_name}</h2>
              <div className="text-slate-500 text-sm">{loan.email} · {loan.phone}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={loan.status} />
              <select
                className="input !w-auto text-sm"
                value={loan.status}
                onChange={(e) => updateStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Mini label="Loan Amount" value={fmtINR(loan.loan_amount)} />
          <Mini label="Interest" value={`${Number(loan.interest_rate).toFixed(2)}%`} />
          <Mini label="Monthly EMI" value={fmtINR(loan.monthly_emi)} />
          <Mini label="Total Amount" value={fmtINR(loan.total_amount)} />
          <Mini label="Total Paid" value={fmtINR(loan.amount_paid)} />
          <Mini label="Remaining" value={fmtINR(loan.remaining_amount)} />
          <Mini label="Tenure" value={`${loan.tenure_months} months`} />
          <Mini label="Due Date" value={loan.due_date} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Section title="Personal Details">
            <Row label="Full Name" value={loan.full_name} />
            <Row label="Email" value={loan.email} />
            <Row label="Phone" value={loan.phone} />
            <Row label="Date of Birth" value={loan.date_of_birth} />
            <Row label="Gender" value={loan.gender} />
          </Section>

          <Section title="Identity">
            <Row label="Aadhaar" value={loan.aadhaar_number} />
            <Row label="PAN" value={loan.pan_number} />
          </Section>

          <Section title="Employment & Loan">
            <Row label="Employment Type" value={loan.employment_type} />
            <Row label="Loan Type" value={loan.loan_type} />
            <Row label="Monthly Income" value={fmtINR(loan.monthly_income)} />
            <Row label="Loan Amount" value={fmtINR(loan.loan_amount)} />
            <Row label="Tenure" value={`${loan.tenure_months} months`} />
          </Section>

          <Section title="Address">
            <Row label="Address" value={loan.address} />
            <Row label="City" value={loan.city} />
            <Row label="State" value={loan.state} />
            <Row label="Pincode" value={loan.pincode} />
          </Section>
        </div>

        {loan.purpose && (
          <Section title="Purpose of Loan">
            <p className="text-slate-700 whitespace-pre-wrap">{loan.purpose}</p>
          </Section>
        )}

        {loan.status === "Pending" && (
          <div className="flex justify-end gap-3">
            <button onClick={() => updateStatus("Rejected")} className="btn-danger">
              Reject Application
            </button>
            <button onClick={() => updateStatus("Approved")} className="btn-success">
              Approve Application
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card">
      <h3 className="font-bold text-slate-800 mb-3">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-50 py-1.5 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value || "-"}</span>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="card !p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-bold text-slate-800 text-lg">{value}</div>
    </div>
  );
}
