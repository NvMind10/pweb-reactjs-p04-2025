import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) {
      setErr("Email & password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const token = await login(form);
      if (!token) throw new Error("Token tidak ditemukan");
      localStorage.setItem("token", token);             // ⬅️ simpan token (syarat wajib)
      nav("/books", { replace: true });                 // ⬅️ redirect ke daftar buku (syarat)
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {err && <p className="text-red-600 text-sm text-center">{err}</p>}

        <button
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded-md font-medium hover:bg-gray-900 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Masuk"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        Belum punya akun?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  </div>
);
}