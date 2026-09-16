import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function StudentAttendancePage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get("/attendance/me");

        setSubjects(
          response.data?.data?.subjects || []
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load attendance."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Student Portal
        </p>

        <h1 className="text-4xl font-black mt-2">
          My Attendance
        </h1>

        <p className="text-slate-400 mt-2">
          View your subject-wise attendance.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">
          Loading attendance...
        </p>
      ) : subjects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
          <p className="text-slate-400">
            No attendance records available yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {subjects.map((subject) => (
            <div
              key={subject.course._id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-blue-400 font-bold">
                    {subject.course.code}
                  </p>

                  <h2 className="text-xl font-bold mt-1">
                    {subject.course.name}
                  </h2>
                </div>

                <BookOpen
                  className="text-blue-400"
                  size={26}
                />
              </div>

              <div className="mt-6">
                <p className="text-4xl font-black">
                  {subject.attendancePercentage}%
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  Attendance
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-slate-950 rounded-xl p-3">
                  <p className="text-slate-400 text-xs">
                    Total
                  </p>
                  <p className="font-bold text-lg mt-1">
                    {subject.totalClasses}
                  </p>
                </div>

                <div className="bg-green-500/10 rounded-xl p-3">
                  <CheckCircle2
                    size={16}
                    className="text-green-400"
                  />
                  <p className="font-bold text-green-400 mt-1">
                    {subject.presentClasses}
                  </p>
                </div>

                <div className="bg-red-500/10 rounded-xl p-3">
                  <XCircle
                    size={16}
                    className="text-red-400"
                  />
                  <p className="font-bold text-red-400 mt-1">
                    {subject.absentClasses}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentAttendancePage;