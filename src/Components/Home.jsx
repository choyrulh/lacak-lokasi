"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 20;

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [uniqueLogs, setUniqueLogs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch logs and locations
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      
      // Fetch logs
      const logsRes = await axios.get(
        "https://backend-movie-apps-api-one.vercel.app/api/logs"
      );
      
      // Process unique logs
      const logsData = logsRes.data.logs || [];
      const unique = Array.from(
        new Map(
          logsData.map((log) => [`${log.ip}-${log.timestamp}`, log])
        ).values()
      );
      setUniqueLogs(unique);
      setLogs(logsData);

      // Fetch locations
      const ipList = [...new Set(unique.map((log) => log.ip))];
      const locations = await Promise.all(
        ipList.map(async (ip) => {
          try {
            const res = await fetch(`https://ipapi.co/${ip}/json/`);
            return await res.json();
          } catch {
            return { ip, city: "Unknown", region: "Unknown", country_name: "Unknown" };
          }
        })
      );
      setLocations(locations);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination
  const totalPages = Math.ceil(uniqueLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLogs = uniqueLogs.slice(startIndex, endIndex);

  // Refresh handler
  const handleRefresh = () => {
    fetchData();
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            Failed to load access logs
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Access Logs - Total {uniqueLogs.length} Unique Visits
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-700">
              <thead className="bg-gray-850">
                <tr>
                  {["Device", "Browser", "OS", "Location", "Org", "IP Address", "Time"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {currentLogs.map((log) => {
                  const location = locations.find((loc) => loc?.ip === log.ip);
                  
                  return (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {log.deviceType || "Desktop"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {log.browser}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {log.os}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {location ? (
                          `${location.city}, ${location.region} (${location.country_name})`
                        ) : (
                          <span className="text-gray-400">Loading...</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {location?.org || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-blue-400">
                        {log.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(log.timestamp).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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