import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen,
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

function StudentTimetablePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await api.get("/timetable/me");

        setEntries(response.data.entries || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load timetable."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Student Portal
        </p>

        <h1 className="text-4xl font-black mt-2">
          My Timetable
        </h1>

        <p className="text-slate-400 mt-2">
          Your weekly schedule based on your enrolled courses.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">
          Loading timetable...
        </p>
      ) : entries.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
          <BookOpen
            className="text-blue-400 mb-4"
            size={30}
          />

          <p className="text-slate-400">
            No classes have been scheduled for your courses yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {days.map((day) => {
            const dayEntries = entries.filter(
              (entry) => entry.day === day
            );

            if (dayEntries.length === 0) {
              return null;
            }

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
                    {dayEntries.length}{" "}
                    {dayEntries.length === 1
                      ? "class"
                      : "classes"}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-5"
                    >
                      <p className="text-blue-400 font-bold">
                        {entry.course?.code}
                      </p>

                      <h3 className="text-lg font-bold mt-1">
                        {entry.course?.name}
                      </h3>

                      <div className="mt-4 space-y-2 text-sm text-slate-400">
                        <p className="flex items-center gap-2">
                          <Clock size={16} />
                          {entry.startTime} - {entry.endTime}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentTimetablePage;