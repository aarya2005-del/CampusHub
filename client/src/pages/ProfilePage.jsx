import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Pencil,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/user/profile");

      setUser(response.data?.user || null);
      setName(response.data?.user?.name || "");
      setEmail(response.data?.user?.email || "");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= EDIT =================
  const openEdit = () => {
  setName(user?.name || "");
  setEmail(user?.email || "");
  setEditing(true);
};
  const closeEdit = () => {
  if (saving) return;

  setName(user?.name || "");
  setEmail(user?.email || "");
  setEditing(false);
};

  const handleSave = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!email.trim()) {
  toast.error("Email is required.");
  return;
}

    try {
      setSaving(true);

      const response = await api.put(
  "/user/profile",
  {
    name: name.trim(),
    email: email.trim(),
  }
);

      const updatedUser = response.data?.user;

      setUser(updatedUser);
      setName(updatedUser?.name || "");
      setEmail(updatedUser?.email || "");
      setEditing(false);

      // Keep localStorage in sync
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedUser,
        })
      );

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white">
        <h1 className="text-4xl font-black">
          Profile
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your account information.
        </p>

        <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-8 text-slate-400">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-white">
        <h1 className="text-4xl font-black">
          Profile
        </h1>

        <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-8 text-slate-400">
          Unable to display profile.
        </div>
      </div>
    );
  }

  const initial =
    user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black">
            Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your account information.
          </p>
        </div>

        <button
          type="button"
          onClick={openEdit}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition"
        >
          <Pencil size={18} />
          Edit Profile
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-black shadow-lg">
              {initial}
            </div>

            <h2 className="text-2xl font-black mt-5">
              {user.name}
            </h2>

            <p className="text-slate-400 mt-1">
              {user.email}
            </p>

            <span className="mt-4 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold capitalize">
              {user.role || "User"}
            </span>
          </div>
        </div>

        {/* Account Information */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-7">
          <div className="mb-6">
            <h2 className="text-xl font-black">
              Account Information
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Your CampusHub account details.
            </p>
          </div>

          <div className="space-y-4">
            <InfoRow
              icon={<User size={20} />}
              label="Full Name"
              value={user.name}
            />

            <InfoRow
              icon={<Mail size={20} />}
              label="Email Address"
              value={user.email}
            />

            <InfoRow
              icon={<Shield size={20} />}
              label="Account Role"
              value={
                user.role
                  ? user.role.charAt(0).toUpperCase() +
                    user.role.slice(1)
                  : "User"
              }
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  Edit Profile
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Update your account information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-5"
            >
              <div>
                <label className="text-sm text-slate-400">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
  <label className="text-sm text-slate-400">
    Email Address
  </label>

  <input
    type="email"
    value={email}
    onChange={(event) =>
      setEmail(event.target.value)
    }
    required
    className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
  />
</div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold disabled:opacity-50"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-2xl p-4">
      <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="font-semibold mt-1 break-all">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;