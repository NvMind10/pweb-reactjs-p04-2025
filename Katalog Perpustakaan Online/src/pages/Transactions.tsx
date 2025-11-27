import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTransactions } from "../api/transactions";

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTransactions({
        page,
        limit,
        search,
        sort,
      });

      setTransactions(res.transactions || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, sort]);

  const maxPage = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="w-screen min-h-screen flex justify-center items-start bg-gray-100 pt-16 px-4">
      {/* CARD BESAR DI TENGAH */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg px-6 py-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">
          <div>
            <h1 className="text-2xl font-semibold">Transactions</h1>
            <p className="text-sm text-gray-500">
              {total
                ? `${total} transaksi ditemukan`
                : "Histori transaksi peminjaman/pembelian buku."}
            </p>
          </div>
        </div>

        {/* SEARCH + SORT */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
          <input
            className="w-full md:w-80 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by transaction ID..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          <select
            className="w-full md:w-56 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="biggest">Total Price High → Low</option>
            <option value="smallest">Total Price Low → High</option>
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="py-8 text-center text-gray-500">Loading...</p>
        )}

        {/* KOSONG */}
        {!loading && transactions.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            No transactions found
          </p>
        )}

        {/* LIST TRANSAKSI */}
        {!loading && transactions.length > 0 && (
          <div className="space-y-4">
            {transactions.map((t) => {
              const itemsText = t.items
                .map((it: any) => `${it.book.title} x${it.quantity}`)
                .join(", ");
              return (
                <Link
                  key={t.id}
                  to={`/transactions/${t.id}`}
                  className="block border border-gray-200 bg-gray-50 rounded-xl p-4 hover:bg-white hover:border-blue-400 hover:shadow-md transition"
                >
                  <p className="font-semibold text-blue-700 text-sm">
                    Transaction #{t.id}
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    Items: {itemsText}
                  </p>
                  <p className="text-sm text-gray-700">
                    Total Items: {t.total_items}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    Total Price: Rp {t.total_price}
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-xs text-gray-500">
            Page {page} / {maxPage}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border rounded-md bg-white disabled:opacity-40 hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              disabled={page >= maxPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-md bg-white disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
