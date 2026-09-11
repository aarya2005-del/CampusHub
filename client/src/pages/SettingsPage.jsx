import { useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function SettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

  const [showPasswords, setShowPasswords] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      form.newPassword !== form.confirmPassword
    ) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      await api.put(
        "/user/change-password",
        form
      );

      toast.success(
        "Password changed successfully"
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black">
          Settings
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your CampusHub account and security.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Security Information */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>

          <h2 className="text-xl font-black mt-5">
            Account Security
          </h2>

          <p className="text-sm text-slate-400 mt-2 leading-6">
            Keep your CampusHub account secure by
            using a strong password that you do not
            use elsewhere.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Lock
                size={16}
                className="text-green-400"
              />
              Minimum 6 characters
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <KeyRound
                size={16}
                className="text-green-400"
              />
              Must differ from current password
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-7">
          <div className="mb-6">
            <h2 className="text-xl font-black">
              Change Password
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Enter your current password before
              choosing a new one.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <PasswordField
              label="Current Password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              visible={showPasswords.current}
              onToggle={() =>
                togglePassword("current")
              }
            />

            <PasswordField
              label="New Password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              visible={showPasswords.new}
              onToggle={() =>
                togglePassword("new")
              }
            />

            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              visible={showPasswords.confirm}
              onToggle={() =>
                togglePassword("confirm")
              }
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <KeyRound size={18} />

                {saving
                  ? "Changing..."
                  : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
}) {
  return (
    <div>
      <label className="text-sm text-slate-400">
        {label}
      </label>

      <div className="relative mt-2">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
          autoComplete="new-password"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-12 outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
        >
          {visible ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;