import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGenres } from "../api/genres";
import { createBook } from "../api/books";

export default function AddBook() {
  const nav = useNavigate();

  const [genres, setGenres] = useState<any[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const [form, setForm] = useState({
    title: "",
    writer: "",
    publisher: "",
    publication_year: "",
    description: "",
    price: "",
    stock_quantity: "",
    genre_id: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Ambil genre dari backend
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch {
        setErr("Failed to load genres");
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenre();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErr("");

    if (!form.title || !form.writer || !form.publisher || !form.genre_id) {
      setErr("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      await createBook({
        ...form,
        publication_year: Number(form.publication_year),
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
      });

      alert("Book added!");
      nav("/books");
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  if (loadingGenres) return <p className="p-6">Loading genres...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add New Book</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Writer"
          value={form.writer}
          onChange={(e) => setForm({ ...form, writer: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Publisher"
          value={form.publisher}
          onChange={(e) => setForm({ ...form, publisher: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Publication Year"
          type="number"
          value={form.publication_year}
          onChange={(e) =>
            setForm({ ...form, publication_year: e.target.value })
          }
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Stock Quantity"
          type="number"
          value={form.stock_quantity}
          onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
        />

        {/* Genre Dropdown */}
        <select
          className="w-full border p-2 rounded"
          value={form.genre_id}
          onChange={(e) => setForm({ ...form, genre_id: e.target.value })}
        >
          <option value="">Select Genre</option>
          {genres.map((g: any) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}