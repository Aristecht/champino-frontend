import axios from "axios";

function resolveApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return "http://localhost:4000/api";
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
});
