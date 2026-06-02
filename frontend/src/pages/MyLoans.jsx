import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = () => {
    setLoading(true);
    api
      .get("/loans/")
      .then((r) => setLoans(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchLoans, []);

  const handlePay = async (loan) => {
    const input = window.prompt(
      `Enter EMI amount to pay (Monthly EMI: ₹${loan.monthly_emi})`,
      String(loan.monthly_emi)
    );
    if (!input) return;
    const amount = Number(input);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await api.post(`/loans/${loan.id}/pay/`, { amount });
      toast.success("Payment recorded");
      fetchLoans();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="user" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">My Loan Applications</h2>
          <Link to="/user/apply" className="btn-primary">+ New Application</Link>
        </div>

        {loading ? (
          <div className="card text-center text-slate-500">Loading...</div>
        ) : loans.length === 0 ? (
          <div className="card text-center text-slate-500">
            <div className="text-4xl">📭</div>
            <p className="mt-2">You haven&apos;t applied for any loan yet.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {loans.map((l) => (
              <LoanCard key={l.id} loan={l} onPay={handlePay} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function LoanCard({ loan, onPay }) {
  const progress = Math.min(
    100,
    (Number(loan.amount_paid) / Number(loan.total_amount || 1)) * 100
  );
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{loan.loan_type}</div>
          <div className="text-2xl font-bold text-slate-800">
            {fmtINR(loan.loan_amount)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Applied on {new Date(loan.created_at).toLocaleDateString()}
          </div>
        </div>
        <StatusBadge status={loan.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
        <Mini label="Interest" value={`${Number(loan.interest_rate).toFixed(2)}%`} />
        <Mini label="EMI" value={fmtINR(loan.monthly_emi)} />
        <Mini label="Total" value={fmtINR(loan.total_amount)} />
        <Mini label="Due" value={loan.due_date} />
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Paid: {fmtINR(loan.amount_paid)}</span>
          <span>Remaining: {fmtINR(loan.remaining_amount)}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {loan.status === "Approved" && Number(loan.remaining_amount) > 0 && (
          <button onClick={() => onPay(loan)} className="btn-primary !py-2 !px-4 text-sm">
            Pay EMI
          </button>
        )}
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold text-slate-800">{value}</div>
    </div>
  );
}
