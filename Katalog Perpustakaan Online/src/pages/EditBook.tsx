import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, updateBook } from "../api/books";
import { getGenres } from "../api/genres";

export default function EditBook() {
  const { id } = useParams();
  const nav = useNavigate();

  // loading khusus untuk fetch data awal
  const [loadingData, setLoadingData] = useState(true);

  // loading khusus untuk tombol submit
  const [submitLoading, setSubmitLoading] = useState(false);

  const [genres, setGenres] = useState<any[]>([]);
  const [err, setErr] = useState("");

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

  // ✅ FETCH data awal (book + genre)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const g = await getGenres();
        setGenres(g);

        const b = await getBookById(id!);

        // prefill form
        setForm({
          title: b.title,
          writer: b.writer,
          publisher: b.publisher,
          publication_year: b.publication_year,
          description: b.description || "",
          price: b.price,
          stock_quantity: b.stock_quantity,
          genre_id: b.genre_id,
        });
      } catch (error: any) {
        setErr(error?.response?.data?.message || "Failed to load book data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id]); // ✅ hanya jalan pertama kali

  // ✅ Submit form update
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    // ✅ jangan reset form atau loadingData
    setSubmitLoading(true);

    try {
      await updateBook(id!, {
        ...form,
        publication_year: Number(form.publication_year),
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
      });

      alert("Book updated!");
      nav(`/books/${id}`);
    } catch (error: any) {
      // ✅ tampilkan error tapi JANGAN reset form
      setErr(error?.response?.data?.message || "Failed to update book");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loadingData) return <p className="p-6">Loading book...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Book</h1>

      {err && <p className="text-red-600 mb-3">{err}</p>}

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
          placeholder="Description"
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
          onChange={(e) =>
            setForm({ ...form, stock_quantity: e.target.value })
          }
        />

        <select
          className="w-full border p-2 rounded"
          value={form.genre_id}
          onChange={(e) => setForm({ ...form, genre_id: e.target.value })}
        >
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <button
          disabled={submitLoading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {submitLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}