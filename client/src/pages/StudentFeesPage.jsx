import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Receipt,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};
function StudentFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await api.get("/fees/me");
        setFees(response.data.fees || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load your fees."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);
const handlePayNow = async (fee) => {
  try {
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      toast.error("Unable to load payment gateway.");
      return;
    }

    const response = await api.post(
      `/payments/create-order/${fee._id}`
    );

    const { order, keyId } = response.data;

    const options = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: "CampusHub",
      description: `${fee.feeType} Fee - Semester ${fee.semester}`,
      order_id: order.id,

      handler: async (paymentResponse) => {
        try {
          await api.post("/payments/verify", {
            feeId: fee._id,
            razorpay_order_id:
              paymentResponse.razorpay_order_id,
            razorpay_payment_id:
              paymentResponse.razorpay_payment_id,
            razorpay_signature:
              paymentResponse.razorpay_signature,
          });

          toast.success(
            "Payment verified successfully"
          );

          const updatedFees = await api.get("/fees/me");
          setFees(updatedFees.data.fees || []);
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "Payment verification failed."
          );
        }
      },

      theme: {},
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      toast.error(
        response.error?.description ||
          "Payment failed."
      );
    });

    razorpay.open();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to start payment."
    );
  }
};
  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <p className="text-slate-400">
        Loading your fee records...
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-blue-400 font-semibold">
          Student Portal
        </p>

        <h1 className="text-4xl font-black mt-2">
          My Fees
        </h1>

        <p className="text-slate-400 mt-2">
          View your fees, outstanding balance, and payment
          history.
        </p>
      </div>

      {fees.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
          <Wallet
            size={32}
            className="text-blue-400 mb-4"
          />

          <h2 className="text-xl font-bold">
            No Fee Records
          </h2>

          <p className="text-slate-400 mt-2">
            No fee records have been assigned to your
            account yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {fees.map((fee) => (
            <div
              key={fee._id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-blue-400 font-bold">
                    {fee.academicYear}
                  </p>

                  <h2 className="text-2xl font-black mt-1">
                    Semester {fee.semester}
                  </h2>
                  <p className="text-purple-400 font-bold mt-2">
  {fee.feeType}
</p>
                </div>

                <span
                  className={`self-start px-3 py-1 rounded-full text-xs font-bold ${
                    fee.status === "Paid"
                      ? "bg-green-500/10 text-green-400"
                      : fee.status === "Partially Paid"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {fee.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-950 rounded-2xl p-5">
                  <CreditCard
                    size={20}
                    className="text-blue-400"
                  />

                  <p className="text-slate-500 text-sm mt-3">
                    Total Fee
                  </p>

                  <p className="text-2xl font-black mt-1">
                    {formatMoney(fee.totalAmount)}
                  </p>
                </div>

                <div className="bg-slate-950 rounded-2xl p-5">
                  <CheckCircle2
                    size={20}
                    className="text-green-400"
                  />

                  <p className="text-slate-500 text-sm mt-3">
                    Amount Paid
                  </p>

                  <p className="text-2xl font-black mt-1">
                    {formatMoney(fee.paidAmount)}
                  </p>
                </div>

                <div className="bg-slate-950 rounded-2xl p-5">
                  <Wallet
                    size={20}
                    className="text-yellow-400"
                  />

                  <p className="text-slate-500 text-sm mt-3">
                    Outstanding
                  </p>

                  <p className="text-2xl font-black mt-1">
                    {formatMoney(fee.balance)}
                  </p>
                </div>
              </div>
              {fee.balance > 0 && (
  <button
    onClick={() => handlePayNow(fee)}
    className="mt-5 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-bold transition"
  >
    Pay Now — {formatMoney(fee.balance)}
  </button>
)}

              <div className="flex items-center gap-2 mt-5 text-slate-400">
                <CalendarDays size={18} />

                <span>
                  Due Date:{" "}
                  {new Date(
                    fee.dueDate
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="border-t border-slate-800 mt-6 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt
                    size={19}
                    className="text-blue-400"
                  />

                  <h3 className="font-bold">
                    Payment History
                  </h3>
                </div>

                {!fee.payments?.length ? (
                  <p className="text-slate-500">
                    No payments recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {fee.payments.map((payment) => (
                      <div
                        key={payment._id}
                        className="bg-slate-950 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div>
                          <p className="font-black">
                            {formatMoney(payment.amount)}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {payment.paymentMethod}
                            {payment.referenceNumber
                              ? ` • ${payment.referenceNumber}`
                              : ""}
                          </p>
                        </div>

                        <p className="text-sm text-slate-400">
                          {new Date(
                            payment.paymentDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentFeesPage;