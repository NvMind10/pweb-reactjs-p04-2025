import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api/auth";

export default function Navbar() {
  const nav = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  // tampilkan email user login di navbar (opsional tapi disarankan)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getMe().then((user) => setEmail(user?.email)).catch(() => setEmail(null));
  }, []);

  const logout = () => {
    localStorage.removeItem("token"); // ⬅️ syarat wajib
    nav("/login", { replace: true }); // ⬅️ kembali ke login
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-4">
        <Link to="/books" className="font-semibold">IT Literature Shop</Link>
        <Link to="/books" className="text-sm hover:underline">Books</Link>
        <Link to="/transactions" className="text-sm hover:underline">Transactions</Link>
        <Link to="/checkout" className="text-sm hover:underline">Checkout</Link>
      </div>
      <div className="flex items-center gap-3">
        {email && <span className="text-sm text-gray-600">{email}</span>}
        <button onClick={logout} className="text-sm underline">Logout</button>
      </div>
    </nav>
  );
}