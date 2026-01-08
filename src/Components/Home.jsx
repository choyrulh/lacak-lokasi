"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Helper untuk styling badge
const Badge = ({ children, color }) => (
  <span className={`px-2 py-1 rounded-md text-xs font-medium ${color}`}>
    {children}
  </span>
);

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  });
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [limit] = useState(10); // Jumlah data per halaman

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(false);
      
      // 1. Fetch data dari API dengan query params page & limit
      const res = await axios.get(
        `https://backend-movie-apps-api-one.vercel.app/api/logs?page=${page}&limit=${limit}`
      );
      
      const { data, pagination: meta } = res.data;
      setLogs(data || []);
      setPagination(meta);

      // 2. Fetch lokasi hanya untuk IP yang ada di halaman ini (Batching)
      const uniqueIps = [...new Set(data.map((log) => log.ip))];
      fetchLocationBatch(uniqueIps);

    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const fetchLocationBatch = async (ips) => {
    const newLocations = { ...locations };
    await Promise.all(
      ips.map(async (ip) => {
        if (!newLocations[ip]) { // Jangan fetch jika sudah ada di state
          try {
            const res = await fetch(`https://ipapi.co/${ip}/json/`);
            newLocations[ip] = await res.json();
          } catch {
            newLocations[ip] = { city: "Unknown", country_name: "Unknown" };
          }
        }
      })
    );
    setLocations(newLocations);
  };

  useEffect(() => {
    fetchData(pagination.currentPage);
  }, [pagination.currentPage, fetchData]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500 p-6 rounded-xl text-center">
          <p className="text-red-400 mb-4">Gagal memuat data log akses.</p>
          <button onClick={() => fetchData(1)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Access Analytics
            </h1>
            <p className="text-slate-400 mt-1">
              Menampilkan {logs.length} dari {pagination.totalRecords} total kunjungan
            </p>
          </div>
          <button
            onClick={() => fetchData(1)}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshIcon className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700">
                  {["User Agent", "Location & Network", "IP Address", "Timestamp"].map((h) => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <SkeletonRows rows={limit} />
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-200">{log.browser}</span>
                          <div className="flex gap-2">
                            <Badge color="bg-blue-500/10 text-blue-400">{log.os}</Badge>
                            <Badge color="bg-purple-500/10 text-purple-400">{log.deviceType || "Desktop"}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-slate-200">
                            {locations[log.ip]?.city ? `${locations[log.ip].city}, ${locations[log.ip].country_name}` : "Locating..."}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">
                            {locations[log.ip]?.org || "ISP Unknown"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-emerald-400 text-xs bg-emerald-400/5 px-2 py-1 rounded border border-emerald-400/20">
                          {log.ip}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(log.timestamp).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-5 border-t border-slate-800 flex items-center justify-between bg-slate-900/80">
            <p className="text-sm text-slate-500">
              Page <span className="text-slate-200 font-medium">{pagination.currentPage}</span> of {pagination.totalPages}
            </p>
            <div className="flex gap-3">
              <button
                disabled={pagination.currentPage === 1 || loading}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="px-4 py-2 text-sm font-medium bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-30 transition-all"
              >
                Previous
              </button>
              <button
                disabled={pagination.currentPage === pagination.totalPages || loading}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-30 transition-all shadow-lg shadow-blue-900/20"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components untuk kerapihan
function RefreshIcon({ className }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function SkeletonRows({ rows }) {
  return [...Array(rows)].map((_, i) => (
    <tr key={i}>
      {[...Array(4)].map((_, j) => (
        <td key={j} className="px-6 py-6">
          <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
        </td>
      ))}
    </tr>
  ));
}