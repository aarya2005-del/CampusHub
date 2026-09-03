import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import api from "../services/api";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    year: "",
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/students", {
        params: {
          name: search || undefined,
          department: department || undefined,
          year: year || undefined,
          sort,
          page,
          limit: 5,
        },
      });

      setStudents(response.data.students || []);
      setTotalStudents(response.data.totalStudents || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(
        "Students API error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, department, year, sort, page]);

  const openCreateForm = () => {
    setEditingStudent(null);

    setForm({
      name: "",
      email: "",
      rollNumber: "",
      department: "",
      year: "",
    });

    setShowForm(true);
  };

  const openEditForm = (student) => {
    setEditingStudent(student);

    setForm({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        year: Number(form.year),
      };

      if (editingStudent) {
  await api.put(
    `/students/${editingStudent._id}`,
    payload
  );

  toast.success("Student updated successfully");
} else {
  await api.post("/students", payload);

  toast.success("Student added successfully");
}

closeForm();
await fetchStudents();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to save student."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
  if (!studentToDelete) return;

  try {
    await api.delete(`/students/${studentToDelete._id}`);

    toast.success("Student deleted successfully");

    setStudentToDelete(null);

    if (students.length === 1 && page > 1) {
      setPage((current) => current - 1);
    } else {
      await fetchStudents();
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to delete student."
    );
  }
};

  const resetFilters = () => {
    setSearch("");
    setDepartment("");
    setYear("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" size={34} />

            <h1 className="text-4xl font-black">
              Students
            </h1>
          </div>

          <p className="text-slate-400 mt-2">
            Manage student records, departments and
            academic years.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-bold transition"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="relative xl:col-span-2">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search students..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <input
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
            placeholder="Department"
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>

          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>
        </div>

        {(search || department || year || sort !== "newest") && (
          <button
            onClick={resetFilters}
            className="mt-4 text-sm text-slate-400 hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Student list */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              Student Directory
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {totalStudents} student
              {totalStudents === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <Users
              size={45}
              className="mx-auto text-slate-600 mb-4"
            />

            <h3 className="text-xl font-bold">
              No students found
            </h3>

            <p className="text-slate-400 mt-2">
              Try changing your filters or add a new student.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950/60 text-slate-400 text-sm">
                <tr>
                  <th className="text-left px-6 py-4">
                    Student
                  </th>
                  <th className="text-left px-6 py-4">
                    Roll Number
                  </th>
                  <th className="text-left px-6 py-4">
                    Department
                  </th>
                  <th className="text-left px-6 py-4">
                    Year
                  </th>
                  <th className="text-right px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold">
                        {student.name}
                      </div>

                      <div className="text-sm text-slate-400">
                        {student.email}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {student.rollNumber}
                    </td>

                    <td className="px-6 py-5">
                      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm">
                        {student.department}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      Year {student.year}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditForm(student)
                          }
                          className="p-2 rounded-lg bg-slate-800 hover:bg-blue-500/20 hover:text-blue-400 transition"
                          title="Edit student"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => setStudentToDelete(student)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 transition"
                          title="Delete student"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-5 border-t border-slate-800 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <span className="text-slate-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  {editingStudent
                    ? "Edit Student"
                    : "Add Student"}
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  {editingStudent
                    ? "Update the student record."
                    : "Create a new student record."}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="p-2 rounded-lg hover:bg-slate-800"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                required
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleChange}
                placeholder="Roll number"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                required
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Department"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />

              <select
                required
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">
                  Select academic year
                </option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingStudent
                    ? "Save Changes"
                    : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {studentToDelete && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-7 shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-5">
        <Trash2 size={28} />
      </div>

      <h2 className="text-2xl font-black">
        Delete Student?
      </h2>

      <p className="text-slate-400 mt-3">
        Are you sure you want to delete{" "}
        <span className="text-white font-semibold">
          {studentToDelete.name}
        </span>
        ? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-7">
        <button
          onClick={() => setStudentToDelete(null)}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold"
        >
          Delete Student
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default StudentsPage;