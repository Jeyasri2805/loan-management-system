import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import "../components/charts";
import { PIE_COLORS } from "../components/charts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmiCalculator from "../components/EmiCalculator.jsx";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/loans/stats/"), api.get("/loans/")])
      .then(([s, l]) => {
        setStats(s.data);
        setLoans(l.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const pieData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [
          stats?.pending || 0,
          stats?.approved || 0,
          stats?.rejected || 0,
        ],
        backgroundColor: ["#f59e0b", "#10b981", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const top = loans.slice(0, 5);
  const barData = {
    labels: top.map((l) => l.loan_type.replace(" Loan", "")),
    datasets: [
      {
        label: "Total Amount",
        data: top.map((l) => Number(l.total_amount)),
        backgroundColor: "#3a64ef",
        borderRadius: 8,
      },
      {
        label: "Paid",
        data: top.map((l) => Number(l.amount_paid)),
        backgroundColor: "#10b981",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="user" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="card bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm opacity-90">Welcome back,</p>
              <h2 className="text-2xl sm:text-3xl font-bold">
                {user?.full_name || user?.email} 👋
              </h2>
              <p className="opacity-90 mt-1">
                Here&apos;s a summary of your loans and financial activity.
              </p>
            </div>
            <Link to="/user/apply" className="btn-secondary !text-brand-700">
              + Apply for new loan
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Applications" value={stats?.total_applications ?? 0} icon="📄" accent="brand" />
          <StatCard label="Approved" value={stats?.approved ?? 0} icon="✅" accent="emerald" />
          <StatCard label="Pending" value={stats?.pending ?? 0} icon="⏳" accent="amber" />
          <StatCard label="Rejected" value={stats?.rejected ?? 0} icon="❌" accent="rose" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Total Borrowed" value={fmtINR(stats?.total_borrowed)} icon="💰" accent="sky" />
          <StatCard label="Total Paid" value={fmtINR(stats?.total_paid)} icon="💳" accent="emerald" />
          <StatCard label="Remaining" value={fmtINR(stats?.total_remaining)} icon="🧾" accent="amber" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card lg:col-span-1">
            <h3 className="font-bold text-slate-800 mb-3">Loan Status</h3>
            <div className="h-64 flex items-center justify-center">
              <Pie data={pieData} options={{ plugins: { legend: { position: "bottom" } } }} />
            </div>
          </div>
          <div className="card lg:col-span-2">
            <h3 className="font-bold text-slate-800 mb-3">EMI / Payment Analysis</h3>
            <div className="h-64">
              {top.length === 0 ? (
                <Empty message="Apply for a loan to see analysis" />
              ) : (
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <EmiCalculator />

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Loan Tracking</h3>
            <Link to="/user/loans" className="text-sm text-brand-700 hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-500">Loading...</div>
          ) : loans.length === 0 ? (
            <Empty
              message="You haven't applied for any loan yet."
              actionLabel="Apply Now"
              actionTo="/user/apply"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 border-b border-slate-100">
                  <tr>
                    <Th>Type</Th>
                    <Th>Amount</Th>
                    <Th>Interest %</Th>
                    <Th>Total</Th>
                    <Th>Paid</Th>
                    <Th>Remaining</Th>
                    <Th>EMI</Th>
                    <Th>Due</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {loans.slice(0, 5).map((l) => (
                    <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <Td className="font-medium text-slate-800">{l.loan_type}</Td>
                      <Td>{fmtINR(l.loan_amount)}</Td>
                      <Td>{Number(l.interest_rate).toFixed(2)}%</Td>
                      <Td>{fmtINR(l.total_amount)}</Td>
                      <Td className="text-emerald-700">{fmtINR(l.amount_paid)}</Td>
                      <Td className="text-amber-700">{fmtINR(l.remaining_amount)}</Td>
                      <Td>{fmtINR(l.monthly_emi)}</Td>
                      <Td>{l.due_date}</Td>
                      <Td><StatusBadge status={l.status} /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const Th = ({ children }) => (
  <th className="py-2 pr-4 font-semibold text-xs uppercase tracking-wide">{children}</th>
);
const Td = ({ children, className = "" }) => (
  <td className={`py-3 pr-4 text-slate-700 ${className}`}>{children}</td>
);

function Empty({ message, actionLabel, actionTo }) {
  return (
    <div className="text-center py-10">
      <div className="text-4xl">📭</div>
      <div className="mt-2 text-slate-500">{message}</div>
      {actionTo && (
        <Link to={actionTo} className="btn-primary mt-4 inline-flex">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
