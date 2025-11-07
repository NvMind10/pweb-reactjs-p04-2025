import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

    fetch();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (err) return <p className="text-red-600 p-6">{err}</p>;
  if (!transaction) return <p className="p-6">Transaction not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction #{transaction.id}</h1>

      <div className="border p-4 rounded mb-6">
        <p><span className="font-semibold">Total Items:</span> {transaction.total_items}</p>
        <p><span className="font-semibold">Total Price:</span> Rp {transaction.total_price}</p>
        <p><span className="font-semibold">Date:</span> {new Date(transaction.created_at).toLocaleString()}</p>
      </div>

      <h2 className="text-xl font-semibold mb-3">Items</h2>

      <div className="space-y-4">
        {transaction.items.map((item: any) => (
          <div key={item.id} className="border p-4 rounded">
            <p className="font-semibold">{item.book.title}</p>
            <p className="text-sm text-gray-600">Price: Rp {item.book.price}</p>
            <p className="text-sm">Qty: {item.quantity}</p>
            <p className="text-sm">
              Subtotal: Rp {item.quantity * item.book.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}