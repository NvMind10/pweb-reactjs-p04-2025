import api from "./axios";

export async function getGenres() {
  const { data } = await api.get("/genre");
  return data.data; // array genre
}