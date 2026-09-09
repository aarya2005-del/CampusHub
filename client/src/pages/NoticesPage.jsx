import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notices");

      setNotices(response.data.notices || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load notices."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingNotice(null);

    setForm({
      title: "",
      description: "",
    });

    setShowForm(true);
  };

  const openEditForm = (notice) => {
    setEditingNotice(notice);

    setForm({
      title: notice.title || "",
      description: notice.description || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingNotice(null);

    setForm({
      title: "",
      description: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      if (editingNotice) {
        await api.put(
          `/notices/${editingNotice._id}`,
          form
        );

        toast.success("Notice updated successfully");
      } else {
        await api.post("/notices", form);

        toast.success("Notice published successfully");
      }

      closeForm();
      await fetchNotices();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (editingNotice
            ? "Unable to update notice."
            : "Unable to publish notice.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!noticeToDelete) return;

    try {
      setDeleting(true);

      await api.delete(
        `/notices/${noticeToDelete._id}`
      );

      toast.success("Notice deleted successfully");

      setNoticeToDelete(null);
      await fetchNotices();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete notice."
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const term = search.trim().toLowerCase();

    return (
      notice.title?.toLowerCase().includes(term) ||
      notice.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black">
            Notices
          </h1>

          <p className="text-slate-400 mt-2">
            Publish and manage campus announcements.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition"
        >
          <Plus size={20} />
          Publish Notice
        </button>
      </div>

      {/* Summary */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <Bell size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Total Notices
            </p>

            <p className="text-3xl font-black">
              {notices.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search notices..."
          className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* Notice List */}
      {loading ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-slate-400">
          Loading notices...
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center">
          <Bell
            size={42}
            className="mx-auto text-slate-600 mb-4"
          />

          <h2 className="text-xl font-bold">
            No notices found
          </h2>

          <p className="text-slate-400 mt-2">
            {search
              ? "Try a different search."
              : "Publish your first campus notice."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice._id}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <Bell size={21} />
                    </div>

                    <div>
                      <h2 className="text-xl font-black">
                        {notice.title}
                      </h2>

                      <p className="text-slate-400 mt-2 whitespace-pre-line">
                        {notice.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={15} />

                      {notice.createdAt
                        ? new Date(
                            notice.createdAt
                          ).toLocaleString()
                        : "Date unavailable"}
                    </div>

                    {notice.createdBy?.name && (
                      <div className="flex items-center gap-2">
                        <User size={15} />
                        {notice.createdBy.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      openEditForm(notice)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-semibold"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setNoticeToDelete(notice)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  {editingNotice
                    ? "Edit Notice"
                    : "Publish Notice"}
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  {editingNotice
                    ? "Update the notice details."
                    : "Publish a new campus announcement."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-slate-400">
                  Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Important announcement"
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Write the notice..."
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold disabled:opacity-50"
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
                    : editingNotice
                      ? "Save Changes"
                      : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {noticeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-5">
              <Trash2 size={28} />
            </div>

            <h2 className="text-2xl font-black">
              Delete Notice?
            </h2>

            <p className="text-slate-400 mt-3">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                {noticeToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={() =>
                  setNoticeToDelete(null)
                }
                disabled={deleting}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Notice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticesPage;