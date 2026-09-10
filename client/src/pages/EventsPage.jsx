import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Plus,
  Users,
  X,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [eventAnalytics, setEventAnalytics] = useState({});

  // Registration
  const [registrationEvent, setRegistrationEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  // Participants
const [participantsEvent, setParticipantsEvent] = useState(null);
const [registrations, setRegistrations] = useState([]);
const [participantsLoading, setParticipantsLoading] = useState(false);
const [removingRegistrationId, setRemovingRegistrationId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    capacity: 100,
  });

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/events");

      setEvents(response.data.events || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH ANALYTICS =================
  const fetchEventAnalytics = async () => {
    try {
      const response = await api.get(
        "/registrations/analytics"
      );

      const stats = response.data?.stats || [];

      const analyticsMap = {};

      stats.forEach((item) => {
        analyticsMap[item.eventId] = item;
      });

      setEventAnalytics(analyticsMap);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load event registrations."
      );
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchEventAnalytics();
  }, []);

  // ================= FORM =================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingEvent(null);

    setForm({
      title: "",
      description: "",
      location: "",
      eventDate: "",
      capacity: 100,
    });

    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);

    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      eventDate: event.eventDate
        ? new Date(event.eventDate)
            .toISOString()
            .slice(0, 16)
        : "",
      capacity: event.capacity || 100,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEvent(null);

    setForm({
      title: "",
      description: "",
      location: "",
      eventDate: "",
      capacity: 100,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        capacity: Number(form.capacity),
      };

      if (editingEvent) {
        await api.put(
          `/events/${editingEvent._id}`,
          payload
        );

        toast.success("Event updated successfully");
      } else {
        await api.post("/events", payload);

        toast.success("Event created successfully");
      }

      closeForm();

      await fetchEvents();
      await fetchEventAnalytics();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (editingEvent
            ? "Unable to update event."
            : "Unable to create event.")
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE EVENT =================
  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      setDeleting(true);

      await api.delete(
        `/events/${eventToDelete._id}`
      );

      toast.success("Event deleted successfully");

      setEventToDelete(null);

      await fetchEvents();
      await fetchEventAnalytics();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete event."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ================= REGISTRATION =================
  const openRegistrationModal = async (event) => {
    setRegistrationEvent(event);
    setStudentSearch("");
    setSelectedStudentId("");
    setStudentsLoading(true);

    try {
      const response = await api.get(
        "/students?limit=100&sort=az"
      );

      setStudents(response.data?.students || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setStudentsLoading(false);
    }
  };

  const closeRegistrationModal = () => {
    if (registering) return;

    setRegistrationEvent(null);
    setStudentSearch("");
    setSelectedStudentId("");
  };

  const handleRegisterStudent = async () => {
    if (!registrationEvent || !selectedStudentId) {
      toast.error("Please select a student.");
      return;
    }

    try {
      setRegistering(true);

      await api.post("/registrations/register", {
        eventId: registrationEvent._id,
        studentId: selectedStudentId,
      });

      toast.success(
        "Student registered successfully"
      );

      setRegistrationEvent(null);
      setSelectedStudentId("");
      setStudentSearch("");

      await fetchEventAnalytics();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to register student."
      );
    } finally {
      setRegistering(false);
    }
  };
// ================= PARTICIPANTS =================
const openParticipantsModal = async (event) => {
  setParticipantsEvent(event);
  setParticipantsLoading(true);
  setRegistrations([]);

  try {
    const response = await api.get(
      `/registrations/event/${event._id}`
    );

    setRegistrations(
      response.data?.data?.registrations || []
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to load participants."
    );
  } finally {
    setParticipantsLoading(false);
  }
};

const closeParticipantsModal = () => {
  if (removingRegistrationId) return;

  setParticipantsEvent(null);
  setRegistrations([]);
};

const handleRemoveParticipant = async (registrationId) => {
  try {
    setRemovingRegistrationId(registrationId);

    await api.delete(
      `/registrations/${registrationId}`
    );

    setRegistrations((current) =>
      current.filter(
        (registration) =>
          registration._id !== registrationId
      )
    );

    toast.success("Student removed from event");

    await fetchEventAnalytics();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to remove student."
    );
  } finally {
    setRemovingRegistrationId(null);
  }
};
  // ================= FILTER STUDENTS =================
  const filteredStudents = students.filter(
    (student) => {
      const term = studentSearch
        .trim()
        .toLowerCase();

      return (
        student.name
          ?.toLowerCase()
          .includes(term) ||
        student.rollNumber
          ?.toLowerCase()
          .includes(term) ||
        student.email
          ?.toLowerCase()
          .includes(term) ||
        student.department
          ?.toLowerCase()
          .includes(term)
      );
    }
  );

  // ================= FILTER EVENTS =================
  const filteredEvents = events.filter((event) => {
    const searchTerm = search
      .trim()
      .toLowerCase();

    const matchesSearch =
      event.title
        ?.toLowerCase()
        .includes(searchTerm) ||
      event.location
        ?.toLowerCase()
        .includes(searchTerm) ||
      event.description
        ?.toLowerCase()
        .includes(searchTerm);

    const eventDate = new Date(event.eventDate);
    const now = new Date();

    const matchesFilter =
      filter === "all" ||
      (filter === "upcoming" &&
        eventDate >= now) ||
      (filter === "past" && eventDate < now);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black">
            Events
          </h1>

          <p className="text-slate-400 mt-2">
            Create and manage campus events.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      {/* Event Count */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <CalendarDays size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Total Events
            </p>

            <p className="text-3xl font-black">
              {events.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
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
            placeholder="Search events..."
            className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="all">
            All Events
          </option>
          <option value="upcoming">
            Upcoming
          </option>
          <option value="past">
            Past
          </option>
        </select>
      </div>

      {/* Events */}
      {loading ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-slate-400">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center">
          <CalendarDays
            size={42}
            className="mx-auto text-slate-600 mb-4"
          />

          <h2 className="text-xl font-bold">
            No events found
          </h2>

          <p className="text-slate-400 mt-2">
            {search || filter !== "all"
              ? "Try changing your search or filter."
              : "Create your first campus event."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEvents.map((event) => {
            const registered =
              eventAnalytics[event._id]?.students ??
              0;

            const percentage = Math.min(
              Math.round(
                (registered / event.capacity) *
                  100
              ) || 0,
              100
            );

            const isFull =
              registered >= event.capacity;

            return (
              <div
                key={event._id}
                className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <CalendarDays size={24} />
                  </div>

                  <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                    {new Date(event.eventDate) >=
                    new Date()
                      ? "Upcoming"
                      : "Past"}
                  </span>
                </div>

                <h2 className="text-xl font-black mt-5">
                  {event.title}
                </h2>

                <p className="text-slate-400 text-sm mt-2 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-3 mt-5 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CalendarDays
                      size={17}
                      className="text-blue-400 shrink-0"
                    />

                    {new Date(
                      event.eventDate
                    ).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin
                      size={17}
                      className="text-purple-400 shrink-0"
                    />

                    {event.location}
                  </div>
                </div>

                {/* Registration Progress */}
                <div className="mt-5">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Users
                        size={17}
                        className="text-green-400 shrink-0"
                      />

                      <span>
                        {registered} /{" "}
                        {event.capacity} registered
                      </span>
                    </div>

                    <span className="text-sm text-green-400 font-bold shrink-0">
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Event Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() =>
                      openRegistrationModal(
                        event
                      )
                    }
                    disabled={isFull}
                    className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 font-semibold disabled:text-slate-600 disabled:cursor-not-allowed"
                  >
                    <Users size={16} />

                    {isFull
                      ? "Event Full"
                      : "Register Student"}
                  </button>
                  <button
  onClick={() => openParticipantsModal(event)}
  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-semibold"
>
  <Users size={16} />
  Participants
</button>

                  <button
                    onClick={() =>
                      openEditForm(event)
                    }
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setEventToDelete(event)
                    }
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold ml-auto"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  {editingEvent
                    ? "Edit Event"
                    : "Create Event"}
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  {editingEvent
                    ? "Update the event details."
                    : "Add a new campus event."}
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
                  Event Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Tech Fest 2026"
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
                  rows={4}
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                  placeholder="Describe the event..."
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Main Auditorium"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Date & Time
                </label>

                <input
                  type="datetime-local"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
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
                    : editingEvent
                      ? "Save Changes"
                      : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Student Modal */}
      {registrationEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  Register Student
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Register a student for{" "}
                  <span className="text-white font-semibold">
                    {registrationEvent.title}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeRegistrationModal
                }
                disabled={registering}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={studentSearch}
                onChange={(event) =>
                  setStudentSearch(
                    event.target.value
                  )
                }
                placeholder="Search by name, roll number, email..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {studentsLoading ? (
                <div className="text-slate-400 py-6 text-center">
                  Loading students...
                </div>
              ) : filteredStudents.length ===
                0 ? (
                <div className="text-slate-400 py-6 text-center">
                  No students found.
                </div>
              ) : (
                filteredStudents.map(
                  (student) => (
                    <button
                      key={student._id}
                      type="button"
                      onClick={() =>
                        setSelectedStudentId(
                          student._id
                        )
                      }
                      className={`w-full text-left p-4 rounded-xl border transition ${
                        selectedStudentId ===
                        student._id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-800 bg-slate-950 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-bold">
                        {student.name}
                      </div>

                      <div className="text-sm text-slate-400 mt-1">
  {student.rollNumber || "No roll number"}{" "}
  -{" "}
  {student.department || "No department"}{" "}
  - Year{" "}
  {student.year || "-"}
</div>

                      <div className="text-xs text-slate-500 mt-1">
                        {student.email}
                      </div>
                    </button>
                  )
                )
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={
                  closeRegistrationModal
                }
                disabled={registering}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleRegisterStudent
                }
                disabled={
                  registering ||
                  !selectedStudentId ||
                  studentsLoading
                }
                className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering
                  ? "Registering..."
                  : "Register Student"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Participants Modal */}
{participantsEvent && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black">
            Event Participants
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            {participantsEvent.title}
          </p>

          <p className="text-green-400 text-sm font-semibold mt-2">
            {registrations.length} /{" "}
            {participantsEvent.capacity} registered
          </p>
        </div>

        <button
          type="button"
          onClick={closeParticipantsModal}
          disabled={Boolean(removingRegistrationId)}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 disabled:opacity-50"
        >
          <X size={22} />
        </button>
      </div>

      {participantsLoading ? (
        <div className="text-center text-slate-400 py-10">
          Loading participants...
        </div>
      ) : registrations.length === 0 ? (
        <div className="border border-slate-800 bg-slate-950 rounded-2xl p-8 text-center">
          <Users
            size={38}
            className="mx-auto text-slate-600 mb-3"
          />

          <h3 className="font-bold">
            No participants yet
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            No students are registered for this event.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map((registration) => {
            const student = registration.student;

            return (
              <div
                key={registration._id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold">
                    {student?.name || "Unknown Student"}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    {student?.rollNumber ||
                      "No roll number"}{" "}
                    -{" "}
                    {student?.department ||
                      "No department"}{" "}
                    - Year {student?.year || "-"}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {student?.email || "No email"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleRemoveParticipant(
                      registration._id
                    )
                  }
                  disabled={
                    removingRegistrationId ===
                    registration._id
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold text-sm disabled:opacity-50"
                >
                  <Trash2 size={15} />

                  {removingRegistrationId ===
                  registration._id
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={closeParticipantsModal}
          disabled={Boolean(removingRegistrationId)}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold disabled:opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Delete Confirmation */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-5">
              <Trash2 size={28} />
            </div>

            <h2 className="text-2xl font-black">
              Delete Event?
            </h2>

            <p className="text-slate-400 mt-3">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                {eventToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={() =>
                  setEventToDelete(null)
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
                  : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage;