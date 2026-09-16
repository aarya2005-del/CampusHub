import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Save,
  Send,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function ResultsPage() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get("/exams");
        setExams(response.data.exams || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load exams."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const fetchExamStudents = async (examId) => {
    if (!examId) {
      setExam(null);
      setStudents([]);
      setMarks({});
      setRemarks({});
      return;
    }

    try {
      setLoadingStudents(true);

      const response = await api.get(
        `/results/exam/${examId}`
      );

      const examData = response.data.exam;
      const studentData = response.data.students || [];

      setExam(examData);
      setStudents(studentData);

      const initialMarks = {};
      const initialRemarks = {};

      studentData.forEach((item) => {
        initialMarks[item.student._id] =
          item.result?.marksObtained ?? "";

        initialRemarks[item.student._id] =
          item.result?.remarks ?? "";
      });

      setMarks(initialMarks);
      setRemarks(initialRemarks);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleExamChange = async (event) => {
    const examId = event.target.value;

    setSelectedExamId(examId);
    await fetchExamStudents(examId);
  };

  const saveStudentResult = async (studentId) => {
    const studentMarks = marks[studentId];

    if (
      studentMarks === "" ||
      studentMarks === undefined
    ) {
      toast.error("Enter marks before saving");
      return;
    }

    try {
      setSavingId(studentId);

      await api.post("/results", {
        examId: selectedExamId,
        studentId,
        marksObtained: Number(studentMarks),
        remarks: remarks[studentId] || "",
      });

      toast.success("Result saved successfully");

      await fetchExamStudents(selectedExamId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save result."
      );
    } finally {
      setSavingId(null);
    }
  };

  const publishResults = async () => {
    if (!selectedExamId) {
      return;
    }

    const enteredResults = students.filter(
      (item) => item.result
    );

    if (enteredResults.length === 0) {
      toast.error(
        "Save at least one result before publishing"
      );
      return;
    }

    try {
      setPublishing(true);

      await api.put(
        `/results/exam/${selectedExamId}/publish`,
        {
          published: true,
        }
      );

      toast.success("Results published successfully");

      await fetchExamStudents(selectedExamId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to publish results."
      );
    } finally {
      setPublishing(false);
    }
  };

  const allEnteredResultsPublished =
    students.length > 0 &&
    students.some((item) => item.result) &&
    students
      .filter((item) => item.result)
      .every((item) => item.result.published);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Academic Management
        </p>

        <h1 className="text-4xl font-black mt-2">
          Results Management
        </h1>

        <p className="text-slate-400 mt-2">
          Enter marks and publish examination results.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
        <div className="flex items-center gap-3 mb-5">
          <BookOpen className="text-blue-400" />

          <h2 className="text-xl font-bold">
            Select Exam
          </h2>
        </div>

        {loading ? (
          <p className="text-slate-400">
            Loading exams...
          </p>
        ) : (
          <select
            value={selectedExamId}
            onChange={handleExamChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">
              Select an examination
            </option>

            {exams.map((examItem) => (
              <option
                key={examItem._id}
                value={examItem._id}
              >
                {examItem.course?.code} -{" "}
                {examItem.examType} -{" "}
                {new Date(
                  examItem.examDate
                ).toLocaleDateString()}
              </option>
            ))}
          </select>
        )}
      </div>

      {exam && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-blue-400 font-bold">
                {exam.course?.code}
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {exam.course?.name}
              </h2>

              <p className="text-slate-400 mt-2">
                {exam.examType} · Maximum Marks:{" "}
                {exam.maxMarks}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Award className="text-purple-400" />

              <span className="font-bold">
                {exam.maxMarks} Marks
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedExamId && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <UserRound className="text-purple-400" />

              <h2 className="text-2xl font-bold">
                Student Results
              </h2>
            </div>

            {students.length > 0 && (
              <button
                type="button"
                onClick={publishResults}
                disabled={
                  publishing ||
                  allEnteredResultsPublished
                }
                className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold disabled:opacity-50"
              >
                {allEnteredResultsPublished ? (
                  <>
                    <CheckCircle2 size={18} />
                    Published
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {publishing
                      ? "Publishing..."
                      : "Publish Results"}
                  </>
                )}
              </button>
            )}
          </div>

          {loadingStudents ? (
            <p className="text-slate-400">
              Loading enrolled students...
            </p>
          ) : students.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
              <p className="text-slate-400">
                No students are enrolled in this course.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((item) => {
                const student = item.student;
                const result = item.result;

                return (
                  <div
                    key={student._id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                  >
                    <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr_1.5fr_auto] gap-4 items-center">
                      <div>
                        <h3 className="font-bold text-lg">
                          {student.name}
                        </h3>

                        <p className="text-slate-400 text-sm mt-1">
                          {student.rollNumber}
                        </p>
                      </div>

                      <input
                        type="number"
                        min="0"
                        max={exam?.maxMarks}
                        step="0.01"
                        value={marks[student._id] ?? ""}
                        onChange={(event) =>
                          setMarks({
                            ...marks,
                            [student._id]:
                              event.target.value,
                          })
                        }
                        placeholder={`Marks / ${
                          exam?.maxMarks || ""
                        }`}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                      />

                      <input
                        type="text"
                        value={
                          remarks[student._id] ?? ""
                        }
                        onChange={(event) =>
                          setRemarks({
                            ...remarks,
                            [student._id]:
                              event.target.value,
                          })
                        }
                        placeholder="Remarks (optional)"
                        className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          saveStudentResult(student._id)
                        }
                        disabled={
                          savingId === student._id
                        }
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold disabled:opacity-50"
                      >
                        <Save size={17} />

                        {savingId === student._id
                          ? "Saving..."
                          : result
                            ? "Update"
                            : "Save"}
                      </button>
                    </div>

                    {result && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            result.status === "Pass"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {result.status}
                        </span>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            result.published
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {result.published
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultsPage;