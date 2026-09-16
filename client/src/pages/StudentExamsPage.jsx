import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function StudentExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get("/exams/me");
        setExams(response.data.exams || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load your exam schedule."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Student Portal
        </p>

        <h1 className="text-4xl font-black mt-2">
          My Exams
        </h1>

        <p className="text-slate-400 mt-2">
          View the exam schedule for your enrolled courses.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">
          Loading exam schedule...
        </p>
      ) : exams.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
          <CalendarDays
            size={30}
            className="text-blue-400 mb-4"
          />

          <p className="text-slate-400">
            No exams have been scheduled for your courses yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {exams.map((exam) => (
            <div
              key={exam._id}
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
                      {exam.course?.code}
                    </p>
                  </div>

                  <h2 className="text-xl font-bold mt-2">
                    {exam.course?.name}
                  </h2>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">
                  {exam.examType}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-2">
                    Date
                  </p>

                  <p className="flex items-center gap-2 font-semibold">
                    <CalendarDays
                      size={16}
                      className="text-blue-400"
                    />

                    {new Date(
                      exam.examDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-slate-950 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-2">
                    Time
                  </p>

                  <p className="flex items-center gap-2 font-semibold">
                    <Clock
                      size={16}
                      className="text-blue-400"
                    />

                    {exam.startTime} - {exam.endTime}
                  </p>
                </div>

                <div className="bg-slate-950 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-2">
                    Room
                  </p>

                  <p className="flex items-center gap-2 font-semibold">
                    <MapPin
                      size={16}
                      className="text-blue-400"
                    />

                    {exam.room}
                  </p>
                </div>

                <div className="bg-slate-950 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-2">
                    Maximum Marks
                  </p>

                  <p className="flex items-center gap-2 font-semibold">
                    <Award
                      size={16}
                      className="text-blue-400"
                    />

                    {exam.maxMarks}
                  </p>
                </div>
              </div>

              {exam.instructions && (
                <div className="mt-5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-400 text-xs uppercase font-bold">
                    Exam Instructions
                  </p>

                  <p className="text-slate-300 mt-2 text-sm">
                    {exam.instructions}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentExamsPage;