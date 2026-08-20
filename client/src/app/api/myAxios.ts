import axios from "axios";

export const myAxios = axios.create({
  baseURL:
    (globalThis as { __env?: { apiUrl?: string } }).__env?.apiUrl ??
    "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
