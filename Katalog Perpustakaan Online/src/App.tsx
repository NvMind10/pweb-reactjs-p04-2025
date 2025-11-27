import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import BooksList from "./pages/BooksList";
import AddBook from "./pages/AddBook";
import BookDetail from "./pages/BookDetail";
import EditBook from "./pages/EditBook";
import Checkout from "./pages/Checkout";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      {/* Navbar hanya muncul kalau sudah login */}
      {token && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Books */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BooksList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/add"
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id/edit"
          element={
            <ProtectedRoute>
              <EditBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:id"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* Transactions */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/:id"
          element={
            <ProtectedRoute>
              <TransactionDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
