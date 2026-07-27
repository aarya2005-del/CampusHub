function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-4">Profile</h1>

      <div className="rounded-3xl bg-white/5 p-6 border border-white/10 mt-6">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}

export default ProfilePage;