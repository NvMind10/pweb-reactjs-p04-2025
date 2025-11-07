import { useEffect, useState } from "react";
import { getBooks } from "../api/books";
import { createTransaction } from "../api/transactions";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const nav = useNavigate();

  const [books, setBooks] = useState<any[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const [cart, setCart] = useState<{ book_id: string; quantity: number }[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState("");

  // ✅ fetch data awal TIDAK DIHAPUS saat error submit
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBooks({ limit: 100 });
        setBooks(res.books);
      } catch (e) {
        setError("Failed to load books.");
      } finally {
        setLoadingBooks(false);
      }
    };
    fetch();
  }, []);

  const setQuantity = (book_id: string, qty: number) => {
    setCart((prev) => {
      const exist = prev.find((x) => x.book_id === book_id);
      if (!exist) return [...prev, { book_id, quantity: qty }];
      return prev.map((x) =>
        x.book_id === book_id ? { ...x, quantity: qty } : x
      );
    });
  };

  const submit = async () => {
    setError("");

    const items = cart.filter((c) => c.quantity > 0);

    if (items.length === 0) {
      setError("Please select at least 1 item.");
      return;
    }

    setSubmitLoading(true);
    try {
      await createTransaction({ items });
      alert("Transaction created!");
      nav("/transactions");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Failed to create transaction."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ loading awal: hanya tampil saat pertama kali fetch
  if (loadingBooks) return <p className="p-6">Loading books...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Checkout Books</h1>

      {/* ✅ error tidak menghilangkan form */}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="space-y-4">
        {books.map((b) => (
          <div
            key={b.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{b.title}</p>
              <p className="text-sm text-gray-500">Rp {b.price}</p>
            </div>

            <input
              type="number"
              min="0"
              max={b.stock_quantity}
              className="border p-2 w-20 rounded"
              onChange={(e) =>
                setQuantity(b.id, Number(e.target.value || 0))
              }
            />
          </div>
        ))}
      </div>

      <button
        disabled={submitLoading}
        onClick={submit}
        className="mt-5 bg-green-600 text-white p-3 rounded w-full"
      >
        {submitLoading ? "Processing..." : "Create Transaction"}
      </button>
    </div>
  );
}