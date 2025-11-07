import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BooksList from "./pages/BooksList";
import Transactions from "./pages/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import BookDetail from "./pages/BookDetail";
import EditBook from "./pages/EditBook";
import AddBook from "./pages/AddBook";
import Checkout from "./pages/Checkout";
import TransactionDetail from "./pages/TransactionDetail";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      {token && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
          path="/books"
          element={
            <ProtectedRoute>
              <BooksList />
            </ProtectedRoute>
          }
        />

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

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}