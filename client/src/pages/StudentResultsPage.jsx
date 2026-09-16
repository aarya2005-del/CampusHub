import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function StudentResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get("/results/me");

        setResults(response.data.results || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load your results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Student Portal
        </p>

        <h1 className="text-4xl font-black mt-2">
          My Results
        </h1>

        <p className="text-slate-400 mt-2">
          View your published examination results.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">
          Loading results...
        </p>
      ) : results.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
          <Award
            size={32}
            className="text-blue-400 mb-4"
          />

          <h2 className="text-xl font-bold">
            No Published Results
          </h2>

          <p className="text-slate-400 mt-2">
            Your examination results will appear here after
            they are published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {results.map((result) => {
            const exam = result.exam;
            const percentage =
              exam?.maxMarks > 0
                ? Math.round(
                    (result.marksObtained /
                      exam.maxMarks) *
                      100
                  )
                : 0;

            return (
              <div
                key={result._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookOpen
                        size={18}
                        className="text-blue-400"
                      />

                      <p className="text-blue-400 font-bold">
                        {exam?.course?.code}
                      </p>
                    </div>

                    <h2 className="text-xl font-bold mt-2">
                      {exam?.course?.name}
                    </h2>

                    <p className="text-slate-400 mt-2">
                      {exam?.examType}
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                      result.status === "Pass"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {result.status === "Pass" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}

                    {result.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-slate-950 rounded-xl p-4">
                    <p className="text-slate-500 text-xs">
                      Marks
                    </p>

                    <p className="text-xl font-black mt-1">
                      {result.marksObtained}
                    </p>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4">
                    <p className="text-slate-500 text-xs">
                      Out Of
                    </p>

                    <p className="text-xl font-black mt-1">
                      {exam?.maxMarks}
                    </p>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4">
                    <p className="text-slate-500 text-xs">
                      Percentage
                    </p>

                    <p className="text-xl font-black mt-1">
                      {percentage}%
                    </p>
                  </div>
                </div>

                {result.remarks && (
                  <div className="mt-5 bg-slate-950 rounded-xl p-4">
                    <p className="text-slate-500 text-xs uppercase font-bold">
                      Remarks
                    </p>

                    <p className="text-slate-300 mt-2">
                      {result.remarks}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentResultsPage;