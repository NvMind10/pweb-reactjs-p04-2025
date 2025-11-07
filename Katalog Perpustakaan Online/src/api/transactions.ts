import api from "./axios";

export async function createTransaction(payload: any) {
  const { data } = await api.post("/transactions", payload);
  return data;
}

export async function getTransactions(params: any = {}) {
  const { data } = await api.get("/transactions", { params });

  // NORMALISASI supaya frontend tidak crash
  const d = data.data;

  // Jika backend mengirim array langsung
  if (Array.isArray(d)) {
    return {
      transactions: d,
      total: d.length,
      page: 1,
      limit: d.length,
    };
  }

  // Jika backend mengirim objek data
  return {
    transactions: d.transactions || d || [],
    total: d.total || 0,
    page: d.page || 1,
    limit: d.limit || 10,
  };
}

export async function getTransactionById(id: string) {
  const { data } = await api.get(`/transactions/${id}`);
  return data.data;
}