import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  GraduationCap,
  MapPin,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
const printStyles = `
  @media print {
    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    body {
      background: white !important;
    }

    body * {
      visibility: hidden;
    }

    #admit-card-print,
    #admit-card-print * {
      visibility: visible;
    }

    #admit-card-print {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      max-width: none;
      margin: 0;
      box-shadow: none !important;
      border-radius: 0 !important;
    }
  }
`;
function StudentAdmitCardPage() {
  const [admitCard, setAdmitCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmitCard = async () => {
      try {
        const response = await api.get("/admit-card/me");
        setAdmitCard(response.data.admitCard);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load admit card."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmitCard();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <p className="text-slate-400">
        Loading admit card...
      </p>
    );
  }

  if (!admitCard) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
        <p className="text-slate-400">
          Admit card is currently unavailable.
        </p>
      </div>
    );
  }

  const { student, exams } = admitCard;

  return (
    <div className="space-y-8">
        <style>{printStyles}</style>
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <p className="text-blue-400 font-semibold">
            Student Portal
          </p>

          <h1 className="text-4xl font-black mt-2">
            Admit Card
          </h1>

          <p className="text-slate-400 mt-2">
            View and print your examination admit card.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-bold transition"
        >
          <Printer size={18} />
          Print Admit Card
        </button>
      </div>

      {/* Admit Card */}
      <div
  id="admit-card-print"
  className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:rounded-none"
>
        {/* Header */}
        <div className="border-b-4 border-slate-900 p-8 text-center">
          <div className="flex justify-center mb-3">
            <GraduationCap size={42} />
          </div>

          <h2 className="text-3xl font-black">
            CampusHub
          </h2>

          <p className="font-semibold mt-1">
            Examination Admit Card
          </p>
        </div>

        {/* Student Details */}
        <div className="p-8 border-b border-slate-300">
          <h3 className="text-lg font-black mb-5">
            Student Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500">
                Student Name
              </p>
              <p className="font-bold mt-1">
                {student.name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-slate-500">
                Roll Number
              </p>
              <p className="font-bold mt-1">
                {student.rollNumber}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-slate-500">
                Department
              </p>
              <p className="font-bold mt-1">
                {student.department}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-slate-500">
                Year
              </p>
              <p className="font-bold mt-1">
                Year {student.year}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase font-bold text-slate-500">
                Email
              </p>
              <p className="font-bold mt-1">
                {student.email}
              </p>
            </div>
          </div>
        </div>

        {/* Examination Schedule */}
        <div className="p-8">
          <h3 className="text-lg font-black mb-5">
            Examination Schedule
          </h3>

          {exams.length === 0 ? (
            <p className="text-slate-500">
              No examinations are currently scheduled.
            </p>
          ) : (
            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="border border-slate-300 rounded-2xl p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="font-black text-lg">
                        {exam.course?.code} —{" "}
                        {exam.course?.name}
                      </p>

                      <p className="text-sm text-slate-600 mt-1">
                        {exam.examType}
                      </p>
                    </div>

                    <span className="text-sm font-bold">
                      Max Marks: {exam.maxMarks}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={17} />
                      {new Date(
                        exam.examDate
                      ).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={17} />
                      {exam.startTime} - {exam.endTime}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={17} />
                      {exam.room}
                    </div>
                  </div>

                  {exam.instructions && (
                    <div className="mt-4 bg-slate-100 rounded-xl p-4">
                      <p className="text-xs uppercase font-bold text-slate-500">
                        Instructions
                      </p>

                      <p className="mt-1 text-sm">
                        {exam.instructions}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-300 px-8 py-5 text-center text-xs text-slate-500">
          This admit card was generated through CampusHub.
        </div>
      </div>
    </div>
  );
}

export default StudentAdmitCardPage;