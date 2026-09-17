import { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function FeesPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
  studentId: "",
  academicYear: "2026-2027",
  semester: "",
  feeType: "Tuition",
  totalAmount: "",
  dueDate: "",
});

  const [paymentFee, setPaymentFee] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "UPI",
    referenceNumber: "",
    paymentDate: "",
  });

  const fetchData = async () => {
    try {
      const [feesResponse, studentsResponse] =
        await Promise.all([
          api.get("/fees"),
          api.get("/students"),
        ]);

      setFees(feesResponse.data.fees || []);

      const studentData =
        studentsResponse.data.students ||
        studentsResponse.data.data ||
        [];

      setStudents(
        Array.isArray(studentData)
          ? studentData
          : studentData.students || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load fees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFee = async (event) => {
    event.preventDefault();

    try {
      await api.post("/fees", {
        ...form,
        semester: Number(form.semester),
        totalAmount: Number(form.totalAmount),
      });

      toast.success("Fee record created successfully");

      setForm({
  studentId: "",
  academicYear: "2026-2027",
  semester: "",
  feeType: "Tuition",
  totalAmount: "",
  dueDate: "",
});
      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create fee record."
      );
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    try {
      await api.post(
        `/fees/${paymentFee._id}/payments`,
        {
          amount: Number(paymentForm.amount),
          paymentMethod:
            paymentForm.paymentMethod,
          referenceNumber:
            paymentForm.referenceNumber,
          paymentDate:
            paymentForm.paymentDate || undefined,
        }
      );

      toast.success("Payment recorded successfully");

      setPaymentFee(null);

      setPaymentForm({
        amount: "",
        paymentMethod: "UPI",
        referenceNumber: "",
        paymentDate: "",
      });

      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to record payment."
      );
    }
  };

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Administration
        </p>

        <h1 className="text-4xl font-black mt-2">
          Fees Management
        </h1>

        <p className="text-slate-400 mt-2">
          Create student fee records and record
          payments.
        </p>
      </div>

      {/* Create Fee */}
      <form
        onSubmit={handleCreateFee}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Plus className="text-blue-400" />

          <h2 className="text-xl font-bold">
            Create Fee Record
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <select
            value={form.studentId}
            onChange={(e) =>
              setForm({
                ...form,
                studentId: e.target.value,
              })
            }
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option
                key={student._id}
                value={student._id}
              >
                {student.name} ({student.rollNumber})
              </option>
            ))}
          </select>

          <input
            value={form.academicYear}
            onChange={(e) =>
              setForm({
                ...form,
                academicYear: e.target.value,
              })
            }
            placeholder="Academic Year"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />

          <input
            type="number"
            min="1"
            max="8"
            value={form.semester}
            onChange={(e) =>
              setForm({
                ...form,
                semester: e.target.value,
              })
            }
            placeholder="Semester"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />
          <select
  value={form.feeType}
  onChange={(e) =>
    setForm({
      ...form,
      feeType: e.target.value,
    })
  }
  required
  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
>
  <option value="Tuition">Tuition</option>
  <option value="Hostel">Hostel</option>
  <option value="Transportation">
    Transportation
  </option>
  <option value="Examination">Examination</option>
  <option value="Library">Library</option>
  <option value="Laboratory">Laboratory</option>
  <option value="Other">Other</option>
</select>

          <input
            type="number"
            min="0"
            value={form.totalAmount}
            onChange={(e) =>
              setForm({
                ...form,
                totalAmount: e.target.value,
              })
            }
            placeholder="Total Amount"
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />

          <input
            type="date"
            onClick={(e) => e.currentTarget.showPicker?.()}
            value={form.dueDate}
            onChange={(e) =>
              setForm({
                ...form,
                dueDate: e.target.value,
              })
            }
            required
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="mt-5 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-bold transition"
        >
          Create Fee
        </button>
      </form>

      {/* Fee Records */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <Wallet className="text-blue-400" />

          <h2 className="text-2xl font-black">
            Student Fee Records
          </h2>
        </div>

        {loading ? (
          <p className="text-slate-400">
            Loading fee records...
          </p>
        ) : fees.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
            <p className="text-slate-400">
              No fee records created yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {fees.map((fee) => (
              <div
                key={fee._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-blue-400 font-bold">
                      {fee.student?.rollNumber}
                    </p>

                    <h3 className="text-xl font-black mt-1">
                      {fee.student?.name}
                    </h3>

                    <p className="text-slate-400 mt-1">
                      {fee.academicYear} • Semester{" "}
                      {fee.semester}
                    </p>
                    <p className="text-sm font-bold text-purple-400 mt-2">
  {fee.feeType}
</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      fee.status === "Paid"
                        ? "bg-green-500/10 text-green-400"
                        : fee.status ===
                          "Partially Paid"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {fee.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-slate-950 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Total
                    </p>
                    <p className="font-black mt-1">
                      {formatMoney(fee.totalAmount)}
                    </p>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Paid
                    </p>
                    <p className="font-black mt-1">
                      {formatMoney(fee.paidAmount)}
                    </p>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Balance
                    </p>
                    <p className="font-black mt-1">
                      {formatMoney(fee.balance)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 mt-5">
                  Due:{" "}
                  {new Date(
                    fee.dueDate
                  ).toLocaleDateString()}
                </p>

                {fee.balance > 0 && (
                  <button
                    onClick={() => setPaymentFee(fee)}
                    className="mt-5 flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-bold transition"
                  >
                    <CreditCard size={17} />
                    Record Payment
                  </button>
                )}

                {fee.payments?.length > 0 && (
                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Receipt
                        size={17}
                        className="text-blue-400"
                      />
                      <p className="font-bold">
                        Payment History
                      </p>
                    </div>

                    <div className="space-y-2">
                      {fee.payments.map((payment) => (
                        <div
                          key={payment._id}
                          className="bg-slate-950 rounded-xl p-3 text-sm flex justify-between gap-4"
                        >
                          <div>
                            <p className="font-bold">
                              {formatMoney(
                                payment.amount
                              )}
                            </p>
                            <p className="text-slate-500">
                              {payment.paymentMethod}
                              {payment.referenceNumber
                                ? ` • ${payment.referenceNumber}`
                                : ""}
                            </p>
                          </div>

                          <p className="text-slate-500">
                            {new Date(
                              payment.paymentDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentFee && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handlePayment}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg"
          >
            <h2 className="text-2xl font-black">
              Record Payment
            </h2>

            <p className="text-slate-400 mt-2">
              {paymentFee.student?.name} • Balance{" "}
              {formatMoney(paymentFee.balance)}
            </p>

            <div className="space-y-4 mt-6">
              <input
                type="number"
                min="1"
                max={paymentFee.balance}
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    amount: e.target.value,
                  })
                }
                placeholder="Payment Amount"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
              />

              <select
                value={paymentForm.paymentMethod}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Other</option>
              </select>

              <input
                value={paymentForm.referenceNumber}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    referenceNumber: e.target.value,
                  })
                }
                placeholder="Reference Number (optional)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
              />

              <input
  type="date"
  onClick={(e) => e.currentTarget.showPicker?.()}
  value={paymentForm.paymentDate}
  onChange={(e) =>
    setPaymentForm({
      ...paymentForm,
      paymentDate: e.target.value,
    })
  }
  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 cursor-pointer"
/>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold"
              >
                Save Payment
              </button>

              <button
                type="button"
                onClick={() => setPaymentFee(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default FeesPage;