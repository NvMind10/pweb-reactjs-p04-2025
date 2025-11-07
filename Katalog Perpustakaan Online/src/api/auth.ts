import api from "./axios";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { username?: string; email: string; password: string };

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  // backend kita mengembalikan {success, message, data: {token}} → sesuaikan:
  const token = data?.data?.token;
  return token;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data?.data; // user object
}