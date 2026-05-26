import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Terminal, ShieldAlert } from 'lucide-react';

export const AuditLogsView = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/audit');
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching audit logs:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Administrative Audit Logs</h2>
        <p className="text-xs text-slate-400">Security event logging recording modifications and logins attempts.</p>
      </div>

      {loading ? (
        <div className="h-44 skeleton"></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800 border rounded-3xl">
          No audit logs recorded yet.
        </div>
      ) : (
        <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 shadow-xl border border-slate-800 font-mono text-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-3">
            <Terminal size={16} />
            <span className="font-bold uppercase tracking-wider text-[10px]">Audit Log Stream Terminal</span>
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {logs.map((log) => (
              <div key={log._id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 space-y-1.5 leading-relaxed text-[11px]">
                <div className="flex flex-col sm:flex-row justify-between gap-1 sm:items-center text-slate-500 font-bold">
                  <span>[IP: {log.ipAddress}]</span>
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-slate-250 text-slate-200">
                  User <strong className="text-emerald-400">{log.userName}</strong> triggered: <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded">{log.action}</strong>
                </div>
                <div className="text-[10px] text-slate-450 text-slate-400 truncate">
                  Target: {log.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsView;
