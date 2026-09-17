import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function LostFoundPage() {
    const currentUser = JSON.parse(
  localStorage.getItem("user") || "null"
);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    type: "Lost",
    itemName: "",
    category: "Electronics",
    description: "",
    location: "",
    itemDate: "",
    contactInfo: "",
  });

  const fetchReports = async () => {
    try {
      const response = await api.get("/lost-found");
      setReports(response.data.reports || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load Lost & Found reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);
const handleResolve = async (reportId) => {
  try {
    await api.patch(
      `/lost-found/${reportId}/resolve`
    );

    toast.success("Report marked as resolved");

    await fetchReports();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to resolve report"
    );
  }
};
const handleDelete = async (reportId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this report?"
  );

  if (!confirmed) return;

  try {
    await api.delete(`/lost-found/${reportId}`);

    toast.success("Report deleted successfully");

    await fetchReports();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to delete report"
    );
  }
};
const filteredReports = reports.filter((report) => {
  const searchText = search.toLowerCase();

  const matchesSearch =
    report.itemName
      .toLowerCase()
      .includes(searchText) ||
    report.description
      .toLowerCase()
      .includes(searchText) ||
    report.location
      .toLowerCase()
      .includes(searchText);

  const matchesType =
    typeFilter === "All" ||
    report.type === typeFilter;

  const matchesStatus =
    statusFilter === "All" ||
    report.status === statusFilter;
    const matchesCategory =
  categoryFilter === "All" ||
  report.category === categoryFilter;

  return (
  matchesSearch &&
  matchesType &&
  matchesStatus &&
  matchesCategory
);
});
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

Object.entries(form).forEach(([key, value]) => {
  formData.append(key, value);
});

if (image) {
  formData.append("image", image);
}

await api.post("/lost-found", formData);

      toast.success("Report created successfully");

      setForm({
        type: "Lost",
        itemName: "",
        category: "Electronics",
        description: "",
        location: "",
        itemDate: "",
        contactInfo: "",
      });
      setImage(null);

      await fetchReports();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create report"
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">
          Lost & Found
        </h1>

        <p className="text-slate-400 mt-2">
          Report and discover lost or found items on campus.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <h2 className="text-xl font-black mb-5">
          Report an Item
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>

          <input
            value={form.itemName}
            onChange={(e) =>
              setForm({
                ...form,
                itemName: e.target.value,
              })
            }
            placeholder="Item name"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          >
            <option value="Electronics">Electronics</option>
            <option value="ID Card">ID Card</option>
            <option value="Books">Books</option>
            <option value="Keys">Keys</option>
            <option value="Wallet">Wallet</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Other">Other</option>
          </select>

          <input
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            placeholder="Location"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />

          <input
            type="date"
            value={form.itemDate}
            onChange={(e) =>
              setForm({
                ...form,
                itemDate: e.target.value,
              })
            }
            onClick={(e) =>
              e.currentTarget.showPicker?.()
            }
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 cursor-pointer"
          />

          <input
            value={form.contactInfo}
            onChange={(e) =>
              setForm({
                ...form,
                contactInfo: e.target.value,
              })
            }
            placeholder="Contact information"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Describe the item"
            required
            rows="4"
            className="md:col-span-2 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 resize-none"
          />
          <div className="md:col-span-2">
  <label className="block text-sm font-bold text-slate-300 mb-2">
    Item Photo (Optional)
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setImage(e.target.files?.[0] || null)
    }
    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
  />

  {image && (
    <p className="text-sm text-slate-400 mt-2">
      Selected: {image.name}
    </p>
  )}
</div>
        </div>

        <button
          type="submit"
          className="mt-5 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition"
        >
          Submit Report
        </button>
      </form>

      <div>
        <h2 className="text-2xl font-black mb-5">
          Campus Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search items, description, location..."
    className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
  />

  <select
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
    className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
  >
    <option value="All">All Types</option>
    <option value="Lost">Lost</option>
    <option value="Found">Found</option>
  </select>
  <select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
>
  <option value="All">All Categories</option>
  <option value="Electronics">Electronics</option>
  <option value="ID Card">ID Card</option>
  <option value="Books">Books</option>
  <option value="Keys">Keys</option>
  <option value="Wallet">Wallet</option>
  <option value="Clothing">Clothing</option>
  <option value="Accessories">Accessories</option>
  <option value="Other">Other</option>
</select>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
  >
    <option value="All">All Statuses</option>
    <option value="Open">Open</option>
    <option value="Resolved">Resolved</option>
  </select>
</div>

        {loading ? (
          <p className="text-slate-400">
            Loading reports...
          </p>
        ) : filteredReports.length === 0 ? (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
    {reports.length === 0
      ? "No Lost & Found reports yet."
      : "No reports match your current search or filters."}
  </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`font-bold ${
                        report.type === "Lost"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {report.type}
                    </p>

                    <h3 className="text-xl font-black mt-1">
                      {report.itemName}
                    </h3>
                  </div>

                  <span className="bg-slate-800 px-3 py-1 rounded-full text-sm font-bold">
                    {report.status}
                  </span>
                </div>

                <p className="text-purple-400 font-bold mt-3">
                  {report.category}
                </p>
                {report.imageUrl && (
  <img
    src={report.imageUrl}
    alt={report.itemName}
    className="w-full h-56 object-cover rounded-xl mt-4 border border-slate-800"
  />
)}

                <p className="text-slate-300 mt-3">
                  {report.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-400">
                  <p>Location: {report.location}</p>

                  <p>
                    Date:{" "}
                    {new Date(
                      report.itemDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Contact: {report.contactInfo}
                  </p>

                  <p>
                    Reported by:{" "}
                    {report.reportedBy?.name || "Unknown"}
                  </p>
                </div>
                {report.status === "Open" &&
  (currentUser?.role === "admin" ||
    report.reportedBy?._id === currentUser?._id) && (
  <button
    onClick={() => handleResolve(report._id)}
    className="mt-5 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-bold transition"
  >
    Mark as Resolved
  </button>
)}
{currentUser?.role === "admin" && (
  <button
    onClick={() => handleDelete(report._id)}
    className="mt-5 ml-3 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl font-bold transition"
  >
    Delete Report
  </button>
)}
              </div>
            ))}
          </div>
        )}
        
      </div>
      
    </div>
  );
}

export default LostFoundPage;