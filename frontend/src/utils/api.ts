import axios from "axios";

const api = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_DOCKER_API
      : process.env.NEXT_PUBLIC_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
