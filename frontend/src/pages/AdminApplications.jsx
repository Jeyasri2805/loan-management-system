import { useEffect, useMemo, useState } from "react";
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

const LOAN_TYPES = [
  "Education Loan",
  "Personal Loan",
  "Home Loan",
  "Vehicle Loan",
  "Business Loan",
];
const STATUSES = ["Pending", "Approved", "Rejected"];

export default function AdminApplications() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "", loan_type: "" });

  const fetchLoans = () => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.loan_type) params.loan_type = filters.loan_type;
    api
      .get("/loans/admin/all/", { params })
      .then((r) => setLoans(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line
  }, [filters.status, filters.loan_type]);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/loans/admin/${id}/status/`, { status });
      toast.success(`Loan ${status.toLowerCase()}`);
      fetchLoans();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="admin" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">All Applications</h2>

        <div className="card mb-4">
          <div className="grid sm:grid-cols-4 gap-3">
            <input
              className="input"
              placeholder="Search name / email / phone / Aadhaar / PAN"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && fetchLoans()}
            />
            <select
              className="input"
              value={filters.loan_type}
              onChange={(e) => setFilters((f) => ({ ...f, loan_type: e.target.value }))}
            >
              <option value="">All Loan Types</option>
              {LOAN_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              className="input"
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={fetchLoans} className="btn-primary">Search</button>
          </div>
        </div>

        <div className="card overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Loading...</div>
          ) : loans.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No applications match your filters.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 border-b border-slate-100">
                <tr>
                  <Th>ID</Th>
                  <Th>Applicant</Th>
                  <Th>Loan Type</Th>
                  <Th>Amount</Th>
                  <Th>Tenure</Th>
                  <Th>EMI</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <Td>#{l.id}</Td>
                    <Td>
                      <div className="font-semibold text-slate-800">{l.full_name}</div>
                      <div className="text-xs text-slate-500">{l.email}</div>
                    </Td>
                    <Td>{l.loan_type}</Td>
                    <Td>{fmtINR(l.loan_amount)}</Td>
                    <Td>{l.tenure_months} mo</Td>
                    <Td>{fmtINR(l.monthly_emi)}</Td>
                    <Td><StatusBadge status={l.status} /></Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/admin/applications/${l.id}`} className="btn-secondary !py-1.5 !px-3 text-xs">View</Link>
                        {l.status === "Pending" && (
                          <>
                            <button onClick={() => handleStatus(l.id, "Approved")} className="btn-success !py-1.5 !px-3 text-xs">Approve</button>
                            <button onClick={() => handleStatus(l.id, "Rejected")} className="btn-danger !py-1.5 !px-3 text-xs">Reject</button>
                          </>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
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
