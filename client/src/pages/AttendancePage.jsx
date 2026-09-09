import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Search,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState({});
  const [savingStudent, setSavingStudent] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const response = await api.get("/students", {
          params: {
            limit: 100,
            sort: "az",
          },
        });

        setStudents(response.data.students || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load students."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);
  useEffect(() => {
  const fetchAttendanceByDate = async () => {
    try {
      setAttendanceLoading(true);
      setAttendance({});
      const response = await api.get("/attendance/date", {
        params: {
          date: selectedDate,
        },
      });

      const records =
        response.data?.data?.attendance || [];

      const attendanceMap = {};

      records.forEach((record) => {
        if (record.student?._id) {
          attendanceMap[record.student._id] =
            record.status;
        }
      });

      setAttendance(attendanceMap);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load attendance."
      );
    }
    finally {
  setAttendanceLoading(false);
}
  };

  fetchAttendanceByDate();
}, [selectedDate]);

  const filteredStudents = students.filter((student) => {
    const term = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(term) ||
      student.rollNumber?.toLowerCase().includes(term) ||
      student.department?.toLowerCase().includes(term)
    );
  });

  const presentCount = Object.values(attendance).filter(
  (status) => status === "present"
).length;

const absentCount = Object.values(attendance).filter(
  (status) => status === "absent"
).length;

const notMarkedCount = Math.max(
  students.length - presentCount - absentCount,
  0
);

  const markAttendance = async (studentId, status) => {
  try {
    setSavingStudent(studentId);

    await api.post("/attendance/mark", {
      studentId,
      date: selectedDate,
      status,
    });

    setAttendance((current) => ({
      ...current,
      [studentId]: status,
    }));

    toast.success(
      status === "present"
        ? "Marked present"
        : "Marked absent"
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to mark attendance."
    );
  } finally {
    setSavingStudent(null);
  }
};

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black">
            Attendance
          </h1>

          <p className="text-slate-400 mt-2">
            Mark and manage daily student attendance.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3">
          <CalendarDays
            size={20}
            className="text-blue-400"
          />

          <input
  type="date"
  value={selectedDate}
  onChange={(event) => {
    
    setSelectedDate(event.target.value);
  }}
  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 outline-none cursor-pointer [color-scheme:dark]"
/>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
    <p className="text-sm text-slate-400">Total Students</p>
    <p className="text-3xl font-black mt-2">
      {students.length}
    </p>
  </div>

  <div className="bg-slate-900/70 border border-green-500/20 rounded-2xl p-5">
    <p className="text-sm text-slate-400">Present</p>
    <p className="text-3xl font-black text-green-400 mt-2">
      {presentCount}
    </p>
  </div>

  <div className="bg-slate-900/70 border border-red-500/20 rounded-2xl p-5">
    <p className="text-sm text-slate-400">Absent</p>
    <p className="text-3xl font-black text-red-400 mt-2">
      {absentCount}
    </p>
  </div>

  <div className="bg-slate-900/70 border border-amber-500/20 rounded-2xl p-5">
    <p className="text-sm text-slate-400">Not Marked</p>
    <p className="text-3xl font-black text-amber-400 mt-2">
      {notMarkedCount}
    </p>
  </div>
</div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" />

            <div>
              <h2 className="font-bold text-lg">
                Student Attendance
              </h2>

              <p className="text-sm text-slate-400">
                {students.length} students
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full md:w-72 bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <p className="text-slate-400">
              Loading students...
            </p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-slate-400">
              No students found.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between gap-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-4"
                >
                  <div>
                    <h3 className="font-bold">
                      {student.name}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      {student.rollNumber} •{" "}
                      {student.department} • Year{" "}
                      {student.year}
                    </p>
                  </div>

                  <div className="flex gap-2">
                   <button
  onClick={() =>
    markAttendance(student._id, "present")
  }
  disabled={
  attendanceLoading ||
  savingStudent === student._id
}
  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
    attendance[student._id] === "present"
      ? "bg-green-500 text-white border-green-400"
      : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
  } disabled:opacity-50`}
>
  <CheckCircle2 size={18} />
  Present
</button>

                    <button
  onClick={() =>
    markAttendance(student._id, "absent")
  }
  disabled={savingStudent === student._id}
  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
    attendance[student._id] === "absent"
      ? "bg-red-500 text-white border-red-400"
      : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
  } disabled:opacity-50`}
>
  <XCircle size={18} />
  Absent
</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;