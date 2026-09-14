import { useEffect, useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    year: "",
    semester: "",
    credits: "",
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/courses");
      setCourses(response.data.courses || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchCourses();

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students", {
        params: {
          limit: 100,
        },
      });

      setStudents(response.data.students || []);
    } catch (error) {
      toast.error("Unable to load students");
    }
  };

  fetchStudents();
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

      await api.post("/courses", {
        ...formData,
        year: Number(formData.year),
        semester: Number(formData.semester),
        credits: Number(formData.credits),
      });

      toast.success("Course created successfully");

      setFormData({
        name: "",
        code: "",
        department: "",
        year: "",
        semester: "",
        credits: "",
      });

      await fetchCourses();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to create course"
      );
    } finally {
      setSaving(false);
    }
  };
  const handleEnrollStudent = async (event) => {
  event.preventDefault();

  if (!selectedCourse || !selectedStudent) {
    toast.error("Please select a student");
    return;
  }

  try {
    setEnrolling(true);

    await api.post("/enrollments", {
      studentId: selectedStudent,
      courseId: selectedCourse._id,
    });

    toast.success("Student enrolled successfully");

    setSelectedCourse(null);
    setSelectedStudent("");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to enroll student"
    );
  } finally {
    setEnrolling(false);
  }
};

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">Academic Management</p>

        <h1 className="text-4xl font-black mt-2">
          Courses & Subjects
        </h1>

        <p className="text-slate-400 mt-2">
          Create and manage academic subjects.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <Plus className="text-blue-400" />
          <h2 className="text-xl font-bold">Add Course</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Course name"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Course code"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="number"
            name="year"
            min="1"
            max="4"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="number"
            name="semester"
            min="1"
            max="8"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="number"
            name="credits"
            min="1"
            value={formData.credits}
            onChange={handleChange}
            placeholder="Credits"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Course"}
        </button>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-purple-400" />

          <h2 className="text-xl font-bold">
            Courses ({courses.length})
          </h2>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-slate-400">
            No courses created yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-blue-400 font-bold">
                      {course.code}
                    </p>

                    <h3 className="text-xl font-bold mt-1">
                      {course.name}
                    </h3>
                  </div>

                  <span className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full h-fit">
                    {course.credits} Credits
                  </span>
                </div>

                <div className="text-slate-400 text-sm mt-4 space-y-1">
                  <p>Department: {course.department}</p>
                  <p>Year: {course.year}</p>
                  <p>Semester: {course.semester}</p>
                </div>
                <button
  onClick={() => {
    setSelectedCourse(course);
    setSelectedStudent("");
  }}
  className="mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-sm"
>
  Enroll Student
</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedCourse && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-7">
      <h2 className="text-2xl font-bold">
        Enroll Student
      </h2>

      <p className="text-slate-400 mt-2">
        {selectedCourse.code} — {selectedCourse.name}
      </p>

      <form onSubmit={handleEnrollStudent} className="mt-6">
        <label className="text-sm text-slate-400">
          Select Student
        </label>

        <select
          value={selectedStudent}
          onChange={(event) =>
            setSelectedStudent(event.target.value)
          }
          required
          className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
        >
          <option value="">Choose a student</option>

          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} — {student.rollNumber}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setSelectedCourse(null);
              setSelectedStudent("");
            }}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={enrolling}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold disabled:opacity-50"
          >
            {enrolling ? "Enrolling..." : "Enroll"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default CoursesPage;