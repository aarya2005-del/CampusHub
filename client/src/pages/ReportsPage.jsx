import { useEffect, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  GraduationCap,
  Building2,
  Printer,
  ClipboardCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function ReportsPage() {
  const [reportType, setReportType] =
    useState("students");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/reports/${reportType}`
      );

      setReport(response.data);
    } catch (error) {
      setReport(null);

      toast.error(
        error.response?.data?.message ||
          "Unable to load report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const escapeCSV = (value) => {
    const text = String(value ?? "");

    return `"${text.replace(/"/g, '""')}"`;
  };

  const downloadCSV = (
    headers,
    rows,
    filename
  ) => {
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map(escapeCSV).join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const date = new Date()
      .toISOString()
      .slice(0, 10);

    if (reportType === "students") {
      if (!report?.students?.length) {
        toast.error(
          "No student data to export."
        );
        return;
      }

      const headers = [
        "Name",
        "Email",
        "Roll Number",
        "Department",
        "Year",
        "Created At",
      ];

      const rows = report.students.map(
        (student) => [
          student.name,
          student.email,
          student.rollNumber,
          student.department,
          student.year,
          new Date(
            student.createdAt
          ).toLocaleDateString(),
        ]
      );

      downloadCSV(
        headers,
        rows,
        `campushub-student-report-${date}.csv`
      );

      toast.success(
        "Student report exported"
      );

      return;
    }

    if (reportType === "attendance") {
      if (!report?.attendance?.length) {
        toast.error(
          "No attendance data to export."
        );
        return;
      }

      const headers = [
        "Student",
        "Roll Number",
        "Department",
        "Course",
        "Course Code",
        "Semester",
        "Date",
        "Status",
      ];

      const rows = report.attendance.map(
        (record) => [
          record.studentName,
          record.rollNumber,
          record.studentDepartment,
          record.courseName,
          record.courseCode,
          record.semester,
          new Date(
            record.date
          ).toLocaleDateString(),
          record.status,
        ]
      );

      downloadCSV(
        headers,
        rows,
        `campushub-attendance-report-${date}.csv`
      );

      toast.success(
        "Attendance report exported"
      );
    }
  };

  const renderStudentReport = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Total Students
              </p>

              <p className="text-3xl font-black">
                {report.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Building2 size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Departments
              </p>

              <p className="text-3xl font-black">
                {report.departmentSummary
                  ?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Report Type
              </p>

              <p className="text-xl font-black">
                Students
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-black">
            Student Report
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Complete student directory for
            administrative reporting.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 text-sm">
              <tr>
                <th className="px-5 py-4">
                  Name
                </th>
                <th className="px-5 py-4">
                  Roll Number
                </th>
                <th className="px-5 py-4">
                  Email
                </th>
                <th className="px-5 py-4">
                  Department
                </th>
                <th className="px-5 py-4">
                  Year
                </th>
              </tr>
            </thead>

            <tbody>
              {report.students?.length > 0 ? (
                report.students.map(
                  (student) => (
                    <tr
                      key={student._id}
                      className="border-t border-slate-800 hover:bg-white/5"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {student.name}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {student.rollNumber}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {student.email}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {student.department}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {student.year}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderAttendanceReport = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <ClipboardCheck
            className="text-blue-400 mb-3"
            size={25}
          />

          <p className="text-sm text-slate-400">
            Total Records
          </p>

          <p className="text-3xl font-black">
            {report.totalRecords}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <CheckCircle
            className="text-emerald-400 mb-3"
            size={25}
          />

          <p className="text-sm text-slate-400">
            Present
          </p>

          <p className="text-3xl font-black">
            {report.presentCount}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <XCircle
            className="text-red-400 mb-3"
            size={25}
          />

          <p className="text-sm text-slate-400">
            Absent
          </p>

          <p className="text-3xl font-black">
            {report.absentCount}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <FileSpreadsheet
            className="text-purple-400 mb-3"
            size={25}
          />

          <p className="text-sm text-slate-400">
            Attendance
          </p>

          <p className="text-3xl font-black">
            {report.attendancePercentage}%
          </p>
        </div>
      </div>

      {report.courseSummary?.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-800">
            <h2 className="text-xl font-black">
              Course Summary
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/60 text-slate-400 text-sm">
                <tr>
                  <th className="px-5 py-4">
                    Course
                  </th>
                  <th className="px-5 py-4">
                    Records
                  </th>
                  <th className="px-5 py-4">
                    Present
                  </th>
                  <th className="px-5 py-4">
                    Absent
                  </th>
                  <th className="px-5 py-4">
                    Attendance
                  </th>
                </tr>
              </thead>

              <tbody>
                {report.courseSummary.map(
                  (course) => (
                    <tr
                      key={course._id}
                      className="border-t border-slate-800"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {course.courseCode ||
                          "Unknown"}{" "}
                        —{" "}
                        {course.courseName ||
                          "Unknown"}
                      </td>

                      <td className="px-5 py-4">
                        {course.totalClasses}
                      </td>

                      <td className="px-5 py-4">
                        {course.present}
                      </td>

                      <td className="px-5 py-4">
                        {course.absent}
                      </td>

                      <td className="px-5 py-4">
                        {
                          course.attendancePercentage
                        }
                        %
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-xl font-black">
            Attendance Records
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Subject-wise student attendance
            records.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-400 text-sm">
              <tr>
                <th className="px-5 py-4">
                  Student
                </th>
                <th className="px-5 py-4">
                  Roll No.
                </th>
                <th className="px-5 py-4">
                  Course
                </th>
                <th className="px-5 py-4">
                  Date
                </th>
                <th className="px-5 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {report.attendance?.length > 0 ? (
                report.attendance.map(
                  (record) => (
                    <tr
                      key={record._id}
                      className="border-t border-slate-800 hover:bg-white/5"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {record.studentName}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {record.rollNumber}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {record.courseCode} —{" "}
                        {record.courseName}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {new Date(
                          record.date
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            record.status ===
                            "present"
                              ? "text-emerald-400 font-bold capitalize"
                              : "text-red-400 font-bold capitalize"
                          }
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className="text-white print-report">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-black">
            Reports
          </h1>

          <p className="text-slate-400 mt-2">
            View and export CampusHub
            administrative reports.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={exportCSV}
            disabled={loading || !report}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition disabled:opacity-50"
          >
            <Download size={19} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            disabled={loading || !report}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition disabled:opacity-50"
          >
            <Printer size={19} />
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="mb-8 print:hidden">
        <label className="block text-sm text-slate-400 mb-2">
          Report Type
        </label>

        <select
          value={reportType}
          onChange={(e) =>
            setReportType(e.target.value)
          }
          className="w-full md:w-72 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="students">
            Student Report
          </option>

          <option value="attendance">
            Attendance Report
          </option>
        </select>
      </div>

      {loading ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-slate-400">
          Loading report...
        </div>
      ) : !report ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-slate-400">
          Report unavailable.
        </div>
      ) : reportType === "students" ? (
        renderStudentReport()
      ) : (
        renderAttendanceReport()
      )}
    </div>
  );
}

export default ReportsPage; 