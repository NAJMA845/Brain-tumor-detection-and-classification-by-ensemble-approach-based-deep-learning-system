import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuditLogs() {
  const navigate = useNavigate();

  // sample/mock data — replace with real API data as needed
  const [logs, setLogs] = useState([
    { id: 1, timestamp: 'Jan 05, 2026 06:04:24', user: 'Dr. Smith', action: 'Created patient record', resource: 'Patient #1', ip: '192.168.1.1' },
    { id: 2, timestamp: 'Jan 05, 2026 05:04:24', user: 'Dr. Johnson', action: 'Uploaded MRI scan', resource: 'Scan #2', ip: '192.168.1.2' },
    { id: 3, timestamp: 'Jan 05, 2026 04:04:24', user: 'Dr. Smith', action: 'Generated report', resource: 'Report #1', ip: '192.168.1.1' },
  ]);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(l =>
      `${l.timestamp} ${l.user} ${l.action} ${l.resource} ${l.ip}`.toLowerCase().includes(q)
    );
  }, [logs, query]);

  function handleRowClick(id) {
    // navigate to a detail route (make sure route exists); fallback: console.log
    navigate(`/audit-logs/${id}`);
  }

  function exportCSV(items) {
    if (!items.length) return;
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'IP Address'];
    const rows = items.map(i => [i.timestamp, i.user, i.action, i.resource, i.ip]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleRefresh() {
    // Replace with real reload/fetch; here we simply reset sample data or could re-fetch.
    setLogs(prev => [...prev]); // no-op to demonstrate refresh UI flow
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Audit Logs</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(filtered)}
            className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50"
            title="Export filtered logs as CSV"
          >
            + Export
          </button>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-teal-500 text-white rounded text-sm hover:opacity-90"
            title="Refresh logs"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-gray-600">System activity and user action logs</p>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search logs..."
          className="ml-4 px-3 py-2 border rounded w-64 text-sm"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Resource</th>
              <th className="py-3 px-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filtered.map(log => (
              <tr
                key={log.id}
                onClick={() => handleRowClick(log.id)}
                className="border-t hover:bg-gray-50 cursor-pointer"
                title="Click for details"
              >
                <td className="py-3 px-4">{log.timestamp}</td>
                <td className="py-3 px-4">{log.user}</td>
                <td className="py-3 px-4">{log.action}</td>
                <td className="py-3 px-4">{log.resource}</td>
                <td className="py-3 px-4 text-right">{log.ip}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 px-4 text-center text-gray-400">No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
