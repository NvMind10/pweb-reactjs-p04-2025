import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTransactionById } from "../api/transactions";

export default function TransactionDetail() {
  const { id } = useParams();

  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTransactionById(id!);
        setTransaction(data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to fetch transaction");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-500">Loading transaction detail...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-screen min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-red-600">{err}</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="w-screen min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-500">Transaction not found</p>
      </div>
    );
  }

  const formatPrice = (n: number) =>
    "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });

  return (
    <div className="w-screen min-h-screen flex justify-center items-start bg-gray-100 pt-16 px-4">
      {/* CARD UTAMA */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg px-6 py-6">
        {/* HEADER + BACK */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Transaction Detail</h1>
            <p className="text-sm text-gray-500">
              Transaction ID: <span className="font-mono">{transaction.id}</span>
            </p>
          </div>

          <Link
            to="/transactions"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Transactions
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Total Items</p>
              <p className="text-lg font-semibold">
                {transaction.total_items}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total Price</p>
              <p className="text-lg font-semibold">
                {formatPrice(transaction.total_price)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="text-sm font-medium">
                {new Date(transaction.created_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <h2 className="text-xl font-semibold mb-3">Items</h2>

        {(!transaction.items || transaction.items.length === 0) && (
          <p className="text-sm text-gray-500">
            No items found in this transaction.
          </p>
        )}

        <div className="space-y-3">
          {transaction.items?.map((item: any) => {
            const subtotal = item.quantity * item.book.price;
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                <p className="font-semibold text-gray-900">
                  {item.book.title}
                </p>
                <p className="text-sm text-gray-600">
                  Price: {formatPrice(item.book.price)}
                </p>
                <p className="text-sm text-gray-700">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-700 font-medium">
                  Subtotal: {formatPrice(subtotal)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
