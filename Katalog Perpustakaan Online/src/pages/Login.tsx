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
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="w-full bg-black text-white p-2 rounded">
          {loading ? "Loading..." : "Masuk"}
        </button>
      </form>
      <p className="mt-3 text-sm">
        Belum punya akun? <Link to="/register" className="underline">Register</Link>
      </p>
    </div>
  );
}