import { useEffect, useMemo, useState } from "react";
import { getBooks } from "../api/books";

const ITEMS_PER_PAGE = 5;

export default function BooksList() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title"); // "title" | "publication_year"
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"
  const [page, setPage] = useState(1);

  // ambil data buku
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res: any = await getBooks(); // <- pake getBooks dari api/books.ts

        if (!res.success) {
          throw new Error(res.message || "Gagal mengambil data buku");
        }

        setBooks(res.data || []);
      } catch (e: any) {
        setError(e?.message || "Gagal mengambil data buku");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // reset page kalau filter/sort/search ganti
  useEffect(() => {
    setPage(1);
  }, [search, conditionFilter, sortBy, sortDir]);

  // ambil daftar kondisi unik
  const conditionOptions = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b && b.condition) set.add(String(b.condition));
    });
    return Array.from(set);
  }, [books]);

  // search + filter + sort
  const processedBooks = useMemo(() => {
    let result = [...books];

    // SEARCH
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((b) => {
        const title = String(b.title ?? "").toLowerCase();
        const writer = String(b.writer ?? "").toLowerCase();
        return title.includes(q) || writer.includes(q);
      });
    }

    // FILTER condition
    if (conditionFilter !== "all") {
      const target = conditionFilter.toLowerCase();
      result = result.filter(
        (b) => String(b.condition ?? "").toLowerCase() === target
      );
    }

    // SORT
    result.sort((a, b) => {
      let compare = 0;
      if (sortBy === "title") {
        compare = String(a.title ?? "").localeCompare(
          String(b.title ?? "")
        );
      } else {
        const ay = Number(a.publication_year ?? 0);
        const by = Number(b.publication_year ?? 0);
        compare = ay - by;
      }
      return sortDir === "asc" ? compare : -compare;
    });

    return result;
  }, [books, search, conditionFilter, sortBy, sortDir]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(processedBooks.length / ITEMS_PER_PAGE)
  );
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentBooks = processedBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) return <p className="text-center mt-8">Loading buku...</p>;
  if (error)
    return (
      <p className="text-center mt-8 text-red-500">
        Terjadi kesalahan: {error}
      </p>
    );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Katalog Buku</h1>

        <div className="controls">
          {/* search */}
          <input
            type="text"
            placeholder="Cari judul / penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* filter condition */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            <option value="all">Semua Kondisi</option>
            {conditionOptions.map((c) => (
              <option key={c} value={c.toLowerCase()}>
                {c}
              </option>
            ))}
          </select>

          {/* sort field */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort by Title</option>
            <option value="publication_year">Sort by Publish Year</option>
          </select>

          {/* sort direction */}
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* tabel utama */}
      {currentBooks.length === 0 ? (
        <p>Tidak ada buku yang cocok dengan filter.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Writer</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Genre</th>
              <th>Condition</th>
              <th>Publish Year</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((b: any) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.writer}</td>
                <td>Rp {b.price}</td>
                <td>{b.stock_quantity}</td>
                <td>{b.genre?.name ?? "-"}</td>
                <td>{b.condition ?? "-"}</td>
                <td>{b.publication_year ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
