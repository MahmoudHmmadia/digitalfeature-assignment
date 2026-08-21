import axios from "axios";

export const myAxios = axios.create({
  baseURL:
    (globalThis as { __env?: { apiUrl?: string } }).__env?.apiUrl ??
    "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
