import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const categories = [
  "study",
  "assignment",
  "exam",
  "meeting",
  "personal",
  "other",
];

function StudentPlannerPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    category: "study",
  });

  const fetchPlanner = async () => {
    try {
      setLoading(true);

      const response = await api.get("/planner/me");
      setItems(response.data.items || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load your planner."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanner();
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

      await api.post("/planner", formData);

      toast.success("Planner item added");

      setFormData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        category: "study",
      });

      await fetchPlanner();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to add planner item."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleCompleted = async (item) => {
    try {
      await api.put(`/planner/${item._id}`, {
        completed: !item.completed,
      });

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem._id === item._id
            ? {
                ...currentItem,
                completed: !currentItem.completed,
              }
            : currentItem
        )
      );

      toast.success(
        item.completed
          ? "Task marked incomplete"
          : "Task completed"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update planner item."
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await api.delete(`/planner/${id}`);

      setItems((currentItems) =>
        currentItems.filter((item) => item._id !== id)
      );

      toast.success("Planner item deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete planner item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Student Portal
        </p>

        <h1 className="text-4xl font-black mt-2">
          Personal Planner
        </h1>

        <p className="text-slate-400 mt-2">
          Organize study sessions, assignments, exams,
          meetings, and personal tasks.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <Plus className="text-blue-400" />

          <h2 className="text-xl font-bold">
            Add Planner Item
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task title"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 [color-scheme:dark]"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() +
                  category.slice(1)}
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
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add to Planner"}
        </button>
      </form>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <CalendarDays className="text-purple-400" />

          <h2 className="text-2xl font-bold">
            My Schedule
          </h2>
        </div>

        {loading ? (
          <p className="text-slate-400">
            Loading planner...
          </p>
        ) : items.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
            <p className="text-slate-400">
              Your planner is empty. Add your first task above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className={`bg-slate-900 border rounded-2xl p-5 ${
                  item.completed
                    ? "border-green-500/30 opacity-70"
                    : "border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => toggleCompleted(item)}
                      className="mt-1"
                    >
                      {item.completed ? (
                        <CheckCircle2
                          size={24}
                          className="text-green-400"
                        />
                      ) : (
                        <Circle
                          size={24}
                          className="text-slate-500"
                        />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          className={`text-lg font-bold ${
                            item.completed
                              ? "line-through text-slate-500"
                              : ""
                          }`}
                        >
                          {item.title}
                        </h3>

                        <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
                          {item.category}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-slate-400 mt-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {new Date(
                            item.date
                          ).toLocaleDateString()}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock size={15} />
                          {item.startTime} - {item.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="text-red-400 hover:bg-red-500/10 rounded-xl p-2 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentPlannerPage;