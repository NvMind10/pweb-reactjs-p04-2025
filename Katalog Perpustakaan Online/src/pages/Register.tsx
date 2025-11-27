import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!form.email || !form.password) {
      setErr("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      nav("/login"); // setelah register arahkan ke login
    } catch (err: any) {
      setErr(err?.response?.data?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

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
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  </div>
);
}