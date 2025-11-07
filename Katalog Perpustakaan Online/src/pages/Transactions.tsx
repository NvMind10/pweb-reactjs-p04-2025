import { useEffect, useState } from "react";
import { getTransactions } from "../api/transactions";
import { Link } from "react-router-dom";

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

  return (
    <div className="p-6">

      <h1 className="text-xl font-semibold mb-4">Transactions</h1>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Search transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="biggest">Total Price High → Low</option>
          <option value="smallest">Total Price Low → High</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Empty */}
      {!loading && transactions.length == 0 && (
        <p>No transactions found</p>
      )}

      {/* List */}
      <div className="space-y-4">
  {transactions.map((t) => {
    const itemsText = t.items
      .map((it: any) => `${it.book.title} x${it.quantity}`)
      .join(", ");

    return (
      <Link
        key={t.id}
        to={`/transactions/${t.id}`}
        className="block border p-4 rounded hover:bg-gray-50"
      >
        <p className="font-semibold text-lg">Transaction #{t.id}</p>

        {/* nama buku + qty */}
        <p className="text-sm text-gray-800">
          Items: {itemsText}
        </p>

        {/* total item */}
        <p className="text-sm text-gray-700">
          Total Items: {t.total_items}
        </p>

        {/* total harga */}
        <p className="text-sm text-gray-700">
          Total Price: Rp {t.total_price}
        </p>

        {/* tanggal */}
        <p className="text-xs mt-1 text-gray-500">
          {new Date(t.created_at).toLocaleString()}
        </p>
      </Link>
    );
  })}
</div>


      {/* Pagination */}
      <div className="flex gap-3 mt-5">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 border rounded"
        >
          Previous
        </button>

        <span className="mt-2">Page {page}</span>

        <button
          disabled={transactions.length < limit}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}