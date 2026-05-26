import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Search, Heart } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ManageDonations = () => {
  const { showToast } = useToast();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/donations', {
        params: { search, status, page, limit: 10 },
      });
      if (res.data.success) {
        setDonations(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching donations list:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [status, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDonations();
  };

  const handleExportCSV = async () => {
    try {
      // Trigger download by opening dynamic iframe or direct URL redirection
      window.open('/api/donations/export', '_blank');
      showToast('Exporting donations history to CSV...', 'info');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Donations Ledger</h2>
          <p className="text-xs text-slate-400">View payment records and export spreadsheet reports.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-650 hover:bg-emerald-700 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 grow w-full">
          <input
            type="text"
            placeholder="Search by name, email, or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-500"
          />
          <button type="submit" className="px-4 py-2 bg-slate-850 bg-slate-900 text-white rounded-xl text-xs font-bold">
            Find
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 w-full sm:w-44"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-12 skeleton"></div>
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          No donations found.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b dark:border-slate-800">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Donor Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-850">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/55 dark:hover:bg-slate-700/10">
                    <td className="p-4 font-mono font-bold text-slate-500">
                      REC-{d._id.substring(18).toUpperCase()}
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-white">
                      {d.name}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 break-all">{d.email}</td>
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-350">{d.purpose}</td>
                    <td className="p-4 font-bold text-slate-850 dark:text-white">
                      ₹{d.amount.toLocaleString()}
                    </td>
                    <td className="p-4 uppercase text-[10px] font-bold text-slate-400">
                      {d.paymentGateway}
                    </td>
                    <td className="p-4 text-slate-400 font-semibold">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold uppercase text-[9px] ${
                          d.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : d.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-105 bg-red-100 text-red-700'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t dark:border-slate-800">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border rounded-xl hover:bg-slate-100 disabled:opacity-50 text-[10px] font-bold"
              >
                Previous
              </button>
              <span className="text-[10px] font-bold text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border rounded-xl hover:bg-slate-100 disabled:opacity-50 text-[10px] font-bold"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageDonations;
