import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Clock,
  MapPin,
  Trash2,
  Plus,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const examTypes = [
  "Internal",
  "Mid Semester",
  "End Semester",
  "Practical",
  "Other",
];

function ExamsPage() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    courseId: "",
    examType: "Internal",
    examDate: "",
    startTime: "",
    endTime: "",
    room: "",
    maxMarks: "",
    instructions: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [coursesResponse, examsResponse] =
        await Promise.all([
          api.get("/courses"),
          api.get("/exams"),
        ]);

      setCourses(coursesResponse.data.courses || []);
      setExams(examsResponse.data.exams || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load exam schedule."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await api.post("/exams", {
        ...formData,
        maxMarks: Number(formData.maxMarks),
      });

      toast.success("Exam scheduled successfully");

      setFormData({
        courseId: "",
        examType: "Internal",
        examDate: "",
        startTime: "",
        endTime: "",
        room: "",
        maxMarks: "",
        instructions: "",
      });

      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to schedule exam."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await api.delete(`/exams/${id}`);

      setExams((currentExams) =>
        currentExams.filter((exam) => exam._id !== id)
      );

      toast.success("Exam deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete exam."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Academic Management
        </p>

        <h1 className="text-4xl font-black mt-2">
          Exam Schedule
        </h1>

        <p className="text-slate-400 mt-2">
          Schedule and manage examinations for campus courses.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <Plus className="text-blue-400" />

          <h2 className="text-xl font-bold">
            Schedule Exam
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select course</option>

            {courses.map((course) => (
              <option
                key={course._id}
                value={course._id}
              >
                {course.code} - {course.name}
              </option>
            ))}
          </select>

          <select
            name="examType"
            value={formData.examType}
            onChange={handleChange}
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 [color-scheme:dark]"
          />

          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 [color-scheme:dark]"
          />

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 [color-scheme:dark]"
          />

          <input
            type="text"
            name="room"
            value={formData.room}
            onChange={handleChange}
            placeholder="Exam room / hall"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="number"
            name="maxMarks"
            value={formData.maxMarks}
            onChange={handleChange}
            placeholder="Maximum marks"
            min="1"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Instructions (optional)"
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 md:col-span-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold disabled:opacity-50"
        >
          {saving ? "Scheduling..." : "Schedule Exam"}
        </button>
      </form>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <CalendarDays className="text-purple-400" />

          <h2 className="text-2xl font-bold">
            Scheduled Exams
          </h2>
        </div>

        {loading ? (
          <p className="text-slate-400">
            Loading exams...
          </p>
        ) : exams.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
            <p className="text-slate-400">
              No exams have been scheduled yet.
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

                    <h3 className="text-xl font-bold mt-2">
                      {exam.course?.name}
                    </h3>

                    <span className="inline-block mt-3 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">
                      {exam.examType}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(exam._id)}
                    disabled={deletingId === exam._id}
                    className="text-red-400 hover:bg-red-500/10 rounded-xl p-2 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-400">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {new Date(
                      exam.examDate
                    ).toLocaleDateString()}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock size={16} />
                    {exam.startTime} - {exam.endTime}
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {exam.room}
                  </p>

                  <p className="flex items-center gap-2">
                    <Award size={16} />
                    {exam.maxMarks} marks
                  </p>
                </div>

                {exam.instructions && (
                  <div className="mt-5 bg-slate-950 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold">
                      Instructions
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
    </div>
  );
}

export default ExamsPage;