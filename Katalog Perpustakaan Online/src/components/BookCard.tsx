import { Link } from "react-router-dom";

export default function BookCard({ book }: { book: any }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="border p-4 rounded hover:bg-gray-50 transition block"
    >
      <h2 className="font-semibold text-lg">{book.title}</h2>
      <p className="text-sm text-gray-700">{book.writer}</p>
      <p className="text-sm">Price: Rp {book.price}</p>
      <p className="text-sm">Stock: {book.stock_quantity}</p>
      <p className="text-xs text-gray-500 mt-1">Genre: {book.genre?.name}</p>
    </Link>
  );
}