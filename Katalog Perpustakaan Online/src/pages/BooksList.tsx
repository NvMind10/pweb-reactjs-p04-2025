import { useEffect, useState } from "react";
import { getBooks } from "../api/books";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

export default function BooksList() {
  const nav = useNavigate();
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");

  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks({
        page,
        limit,
        search,
        order,
      });

      setBooks(res.books);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search, order]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Books Catalog</h1>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <input
          className="border p-2 rounded w-60"
          placeholder="Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="asc">Sort: Title ASC</option>
          <option value="desc">Sort: Title DESC</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Empty */}
      {!loading && books.length === 0 && <p>No books found.</p>}
      
      <button
        onClick={() => nav("/books/add")}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Book
      </button>


      {/* Books grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book: any) => (
          <BookCard book={book} key={book.id} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 border rounded"
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="mt-2">Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded"
          disabled={books.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
}