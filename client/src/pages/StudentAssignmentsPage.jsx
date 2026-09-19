import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [submissionMessages, setSubmissionMessages] =
    useState({});
    const [submissionFiles, setSubmissionFiles] =
  useState({});

  const fetchAssignments = async () => {
    try {
      const [assignmentResponse, submissionResponse] =
        await Promise.all([
          api.get("/assignments/me"),
          api.get("/assignment-submissions/me"),
        ]);

      setAssignments(
        assignmentResponse.data.assignments || []
      );

      setSubmissions(
        submissionResponse.data.submissions || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load your assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId) => {
  const message =
    submissionMessages[assignmentId] || "";

  const file =
    submissionFiles[assignmentId] || null;

  if (!message.trim() && !file) {
    toast.error(
      "Please enter a submission or attach a file"
    );
    return;
  }

  try {
    const formData = new FormData();

    formData.append("message", message);

    if (file) {
      formData.append("file", file);
    }

    await api.post(
      `/assignment-submissions/${assignmentId}`,
      formData
    );

    toast.success(
      "Assignment submitted successfully"
    );

    setSubmissionMessages((previous) => ({
      ...previous,
      [assignmentId]: "",
    }));

    setSubmissionFiles((previous) => ({
      ...previous,
      [assignmentId]: null,
    }));

    await fetchAssignments();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to submit assignment"
    );
  }
};

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">
          My Assignments
        </h1>

        <p className="text-slate-400 mt-2">
          View assignments for your enrolled subjects.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">
          Loading assignments...
        </p>
      ) : assignments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          No published assignments available.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {assignments.map((assignment) => {
            const submission = submissions.find(
              (item) =>
                item.assignment?._id === assignment._id
            );

            return (
              <div
                key={assignment._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >
                <p className="text-blue-400 font-bold">
                  {assignment.course?.code}
                </p>

                <h2 className="text-xl font-black mt-1">
                  {assignment.title}
                </h2>

                <p className="text-purple-400 font-bold mt-2">
                  {assignment.course?.name}
                </p>

                <p className="text-slate-300 mt-4">
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
                    Assigned by:{" "}
                    {assignment.createdBy?.name ||
                      "Unknown"}
                  </p>
                </div>

                {submission ? (
                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <div className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                      Submitted ✓
                    </div>

                    <p className="text-slate-400 text-sm mt-3">
                      Submitted on:{" "}
                      {new Date(
                        submission.submittedAt
                      ).toLocaleString()}
                    </p>

                    {submission.message && (
                      <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-2">
                          Your Response
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

                    {submission.marksObtained !== null &&
                      submission.marksObtained !==
                        undefined && (
                        <div className="mt-4">
                          <p className="font-bold">
                            Marks:{" "}
                            {submission.marksObtained} /{" "}
                            {assignment.maxMarks}
                          </p>

                          {submission.feedback && (
                            <p className="text-slate-400 mt-2">
                              Feedback:{" "}
                              {submission.feedback}
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <label className="block font-bold mb-2">
                      Your Submission
                    </label>

                    <textarea
                      value={
                        submissionMessages[
                          assignment._id
                        ] || ""
                      }
                      onChange={(e) =>
                        setSubmissionMessages(
                          (previous) => ({
                            ...previous,
                            [assignment._id]:
                              e.target.value,
                          })
                        )
                      }
                      placeholder="Enter your assignment response..."
                      rows="4"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 resize-none"
                    />
                    <div className="mt-3">
  <label className="block text-sm font-bold mb-2">
    Attachment (Optional)
  </label>

  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png,.webp"
    onChange={(e) =>
      setSubmissionFiles((previous) => ({
        ...previous,
        [assignment._id]:
          e.target.files?.[0] || null,
      }))
    }
    className="block w-full text-sm text-slate-400
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:bg-slate-800 file:text-white
      file:font-bold hover:file:bg-slate-700"
  />

  <p className="text-xs text-slate-500 mt-2">
    PDF, JPG, PNG or WEBP — maximum 5 MB
  </p>
</div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSubmit(
                          assignment._id
                        )
                      }
                      className="mt-3 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-bold transition"
                    >
                      Submit Assignment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentAssignmentsPage;