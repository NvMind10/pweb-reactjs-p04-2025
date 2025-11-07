import api from "./axios";

export async function getBooks(params: any = {}) {
  const { data } = await api.get("/books", { params });
  return data.data; // { total, page, limit, books }
}

export async function getBookById(id: string) {
  const { data } = await api.get(`/books/${id}`);
  return data.data;
}

export async function deleteBook(id: string) {
  const { data } = await api.delete(`/books/${id}`);
  return data;
}

export async function createBook(payload: any) {
  const { data } = await api.post("/books", payload);
  return data;
}

export async function updateBook(id: string, payload: any) {
  const { data } = await api.patch(`/books/${id}`, payload);
  return data;
}