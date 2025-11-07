import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById, deleteBook } from "../api/books";

export default function BookDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchBook = async () => {
    setLoading(true);
    try {
      const data = await getBookById(id!);
      setBook(data);
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Failed to fetch book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this book?");
    if (!confirmDelete) return;

    try {
      await deleteBook(id!);
      alert("Book deleted");
      nav("/books");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete book");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;

  if (!book) return <p className="p-6">Book not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-3">{book.title}</h1>

      <div className="space-y-2">
        <p><span className="font-semibold">Writer:</span> {book.writer}</p>
        <p><span className="font-semibold">Publisher:</span> {book.publisher}</p>
        <p><span className="font-semibold">Genre:</span> {book.genre?.name}</p>
        <p><span className="font-semibold">Price:</span> Rp {book.price}</p>
        <p><span className="font-semibold">Stock:</span> {book.stock_quantity}</p>
        <p><span className="font-semibold">Publication Year:</span> {book.publication_year}</p>

        {book.description && (
          <p>
            <span className="font-semibold">Description:</span>
            <span> {book.description}</span>
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete Book
        </button>

        <button
          onClick={() => nav(`/books/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Edit Book
        </button>
      </div>
    </div>
  );
}