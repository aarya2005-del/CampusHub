import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] =
  useState(null);

const [submissions, setSubmissions] = useState([]);

const [submissionsLoading, setSubmissionsLoading] =
  useState(false);
  const [gradeForms, setGradeForms] = useState({});

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    maxMarks: "",
    status: "Published",
  });

  const fetchData = async () => {
    try {
      const [assignmentResponse, courseResponse] =
        await Promise.all([
          api.get("/assignments"),
          api.get("/courses"),
        ]);

      setAssignments(
        assignmentResponse.data.assignments || []
      );

      setCourses(
        courseResponse.data.courses || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load assignments"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleViewSubmissions = async (assignment) => {
  try {
    setSelectedAssignment(assignment);
    setSubmissionsLoading(true);

    const response = await api.get(
      `/assignment-submissions/assignment/${assignment._id}`
    );

    setSubmissions(
      response.data.submissions || []
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to load submissions"
    );

    setSubmissions([]);
  } finally {
    setSubmissionsLoading(false);
  }
};
const handleGradeSubmission = async (
  submissionId
) => {
  const grade = gradeForms[submissionId] || {};

  if (
    grade.marksObtained === undefined ||
    grade.marksObtained === ""
  ) {
    toast.error("Please enter marks");
    return;
  }

  try {
    await api.patch(
      `/assignment-submissions/${submissionId}/grade`,
      {
        marksObtained: Number(
          grade.marksObtained
        ),
        feedback: grade.feedback || "",
      }
    );

    toast.success(
      "Submission graded successfully"
    );

    if (selectedAssignment) {
      await handleViewSubmissions(
        selectedAssignment
      );
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to grade submission"
    );
  }
};
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/assignments", {
        ...form,
        maxMarks: Number(form.maxMarks),
      });

      toast.success("Assignment created successfully");

      setForm({
        courseId: "",
        title: "",
        description: "",
        dueDate: "",
        maxMarks: "",
        status: "Published",
      });

      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create assignment"
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">
          Assignments
        </h1>

        <p className="text-slate-400 mt-2">
          Create and manage subject assignments.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <h2 className="text-xl font-black mb-5">
          Create Assignment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={form.courseId}
            onChange={(e) =>
              setForm({
                ...form,
                courseId: e.target.value,
              })
            }
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          >
            <option value="">
              Select Subject
            </option>

            {courses.map((course) => (
              <option
                key={course._id}
                value={course._id}
              >
                {course.code} - {course.name}
              </option>
            ))}
          </select>

          <input
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            placeholder="Assignment title"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />

          <input
            type="datetime-local"
            value={form.dueDate}
            onChange={(e) =>
              setForm({
                ...form,
                dueDate: e.target.value,
              })
            }
            onClick={(e) =>
              e.currentTarget.showPicker?.()
            }
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 cursor-pointer"
          />

          <input
            type="number"
            min="1"
            value={form.maxMarks}
            onChange={(e) =>
              setForm({
                ...form,
                maxMarks: e.target.value,
              })
            }
            placeholder="Maximum marks"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          >
            <option value="Published">
              Published
            </option>
            <option value="Draft">
              Draft
            </option>
          </select>

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Assignment instructions"
            required
            rows="4"
            className="md:col-span-2 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-5 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition"
        >
          Create Assignment
        </button>
      </form>

      <div>
        <h2 className="text-2xl font-black mb-5">
          Existing Assignments
        </h2>

        {loading ? (
          <p className="text-slate-400">
            Loading assignments...
          </p>
        ) : assignments.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No assignments created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-blue-400 font-bold">
                      {assignment.course?.code}
                    </p>

                    <h3 className="text-xl font-black mt-1">
                      {assignment.title}
                    </h3>
                  </div>

                  <span className="bg-slate-800 px-3 py-1 rounded-full text-sm font-bold h-fit">
                    {assignment.status}
                  </span>
                </div>

                <p className="text-purple-400 font-bold mt-3">
                  {assignment.course?.name}
                </p>

                <p className="text-slate-300 mt-3">
                  {assignment.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-400">
                  <p>
                    Due:{" "}
                    {new Date(
                      assignment.dueDate
                    ).toLocaleString()}
                  </p>

                  <p>
                    Maximum Marks:{" "}
                    {assignment.maxMarks}
                  </p>

                  <p>
                    Created by:{" "}
                    {assignment.createdBy?.name ||
                      "Unknown"}
                  </p>
                </div>
                <button
  type="button"
  onClick={() =>
    handleViewSubmissions(assignment)
  }
  className="mt-5 bg-purple-600 hover:bg-purple-500 px-5 py-2.5 rounded-xl font-bold transition"
>
  View Submissions
</button>
              </div>
            ))}
          </div>
        )}
        
      </div>
      {selectedAssignment && (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
    <div className="flex items-center justify-between gap-4 mb-5">
      <div>
        <h2 className="text-2xl font-black">
          Submissions
        </h2>

        <p className="text-slate-400 mt-1">
          {selectedAssignment.course?.code} -{" "}
          {selectedAssignment.title}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setSelectedAssignment(null);
          setSubmissions([]);
        }}
        className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl font-bold transition"
      >
        Close
      </button>
    </div>

    {submissionsLoading ? (
      <p className="text-slate-400">
        Loading submissions...
      </p>
    ) : submissions.length === 0 ? (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        No students have submitted this assignment yet.
      </div>
    ) : (
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="bg-slate-950 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-black text-lg">
                  {submission.student?.name ||
                    "Unknown Student"}
                </h3>

                <p className="text-slate-400 text-sm">
                  {submission.student?.rollNumber ||
                    "No roll number"}
                </p>
              </div>

              <span className="text-green-400 font-bold text-sm">
                Submitted
              </span>
            </div>

            <p className="text-slate-400 text-sm mt-3">
              Submitted on:{" "}
              {new Date(
                submission.submittedAt
              ).toLocaleString()}
            </p>

            {submission.message && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-2">
                  Student Response
                </p>

                <p className="text-slate-300">
                  {submission.message}
                </p>
              </div>
            )}
            {submission.fileUrl && (
  <a
    href={submission.fileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-bold"
  >
    View Attachment ↗
  </a>
)}
            <div className="mt-5 border-t border-slate-800 pt-5">
  <p className="font-bold mb-3">
    Grade Submission
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <input
      type="number"
      min="0"
      max={selectedAssignment.maxMarks}
      value={
        gradeForms[submission._id]
          ?.marksObtained ??
        submission.marksObtained ??
        ""
      }
      onChange={(e) =>
        setGradeForms((previous) => ({
          ...previous,
          [submission._id]: {
            ...previous[submission._id],
            marksObtained: e.target.value,
          },
        }))
      }
      placeholder={`Marks out of ${selectedAssignment.maxMarks}`}
      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
    />

    <input
      type="text"
      value={
        gradeForms[submission._id]?.feedback ??
        submission.feedback ??
        ""
      }
      onChange={(e) =>
        setGradeForms((previous) => ({
          ...previous,
          [submission._id]: {
            ...previous[submission._id],
            feedback: e.target.value,
          },
        }))
      }
      placeholder="Feedback"
      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3"
    />
  </div>

  <button
    type="button"
    onClick={() =>
      handleGradeSubmission(submission._id)
    }
    className="mt-3 bg-green-600 hover:bg-green-500 px-5 py-2.5 rounded-xl font-bold transition"
  >
    Save Grade
  </button>
</div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
    </div>
  );
}

export default AssignmentsPage;