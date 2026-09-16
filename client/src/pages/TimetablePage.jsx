import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Trash2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function TimetablePage() {
  const [courses, setCourses] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    courseId: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    room: "",
    facultyName: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [coursesResponse, timetableResponse] =
        await Promise.all([
          api.get("/courses"),
          api.get("/timetable"),
        ]);

      setCourses(coursesResponse.data.courses || []);
      setEntries(timetableResponse.data.entries || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load timetable."
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

      await api.post("/timetable", formData);

      toast.success("Timetable entry created successfully");

      setFormData({
        courseId: "",
        day: "Monday",
        startTime: "",
        endTime: "",
        room: "",
        facultyName: "",
      });

      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create timetable entry."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await api.delete(`/timetable/${id}`);

      toast.success("Timetable entry deleted");
      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete timetable entry."
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
          Official Timetable
        </h1>

        <p className="text-slate-400 mt-2">
          Schedule classes for campus courses.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <Plus className="text-blue-400" />
          <h2 className="text-xl font-bold">
            Add Class
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
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

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
            name="room"
            value={formData.room}
            onChange={handleChange}
            placeholder="Room / Lab"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            name="facultyName"
            value={formData.facultyName}
            onChange={handleChange}
            placeholder="Faculty name"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold disabled:opacity-50"
        >
          {saving ? "Creating..." : "Add to Timetable"}
        </button>
      </form>

      <div className="space-y-6">
        {loading ? (
          <p className="text-slate-400">
            Loading timetable...
          </p>
        ) : (
          days.map((day) => {
            const dayEntries = entries.filter(
              (entry) => entry.day === day
            );

            return (
              <div
                key={day}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <CalendarDays className="text-purple-400" />

                  <h2 className="text-xl font-bold">
                    {day}
                  </h2>

                  <span className="text-sm text-slate-500">
                    {dayEntries.length} classes
                  </span>
                </div>

                {dayEntries.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No classes scheduled.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry._id}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-5"
                      >
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="text-blue-400 font-bold">
                              {entry.course?.code}
                            </p>

                            <h3 className="font-bold text-lg mt-1">
                              {entry.course?.name}
                            </h3>
                          </div>

                          <button
                            onClick={() =>
                              handleDelete(entry._id)
                            }
                            disabled={
                              deletingId === entry._id
                            }
                            className="text-red-400 hover:bg-red-500/10 rounded-xl p-2 h-fit disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-4 space-y-2 text-sm text-slate-400">
                          <p className="flex items-center gap-2">
                            <Clock size={16} />
                            {entry.startTime} -{" "}
                            {entry.endTime}
                          </p>

                          <p className="flex items-center gap-2">
                            <MapPin size={16} />
                            {entry.room}
                          </p>

                          <p className="flex items-center gap-2">
                            <User size={16} />
                            {entry.facultyName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TimetablePage;