import { useEffect, useState } from "react";
import {
  Activity,
  Clock,
  ShieldCheck,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/audit-logs"
        );

        setLogs(response.data?.logs || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load audit logs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getActionClass = (action) => {
    if (action === "CREATE") {
      return "bg-emerald-500/10 text-emerald-400";
    }

    if (action === "UPDATE") {
      return "bg-blue-500/10 text-blue-400";
    }

    if (action === "DELETE") {
      return "bg-red-500/10 text-red-400";
    }

    return "bg-slate-500/10 text-slate-300";
  };

  if (loading) {
    return (
      <div className="text-slate-400">
        Loading audit logs...
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-4xl font-black">
              Audit Logs
            </h1>

            <p className="text-slate-400 mt-1">
              Administrative activity history.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-3">
          <Activity
            size={22}
            className="text-purple-400"
          />

          <div>
            <p className="text-sm text-slate-400">
              Recorded Activities
            </p>

            <p className="text-2xl font-black">
              {logs.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 text-sm">
              <tr>
                <th className="px-5 py-4">
                  Action
                </th>

                <th className="px-5 py-4">
                  Resource
                </th>

                <th className="px-5 py-4">
                  Details
                </th>

                <th className="px-5 py-4">
                  Performed By
                </th>

                <th className="px-5 py-4">
                  Date & Time
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-t border-slate-800 hover:bg-white/5"
                  >
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${getActionClass(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {log.resourceType}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {log.details || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <User
                          size={16}
                          className="text-slate-500"
                        />

                        <div>
                          <p className="font-semibold">
                            {log.user?.name ||
                              "Unknown User"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {log.user?.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock
                          size={16}
                          className="text-slate-500"
                        />

                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    No audit activity recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AuditLogsPage;