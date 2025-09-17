import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:6060/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptors básicos
client.interceptors.response.use(
  (res) => res,
  (error) => {
    // normalize errors
    if (error.response) {
      return Promise.reject(error.response.data || { message: error.message });
    }
    return Promise.reject({ message: error.message });
  }
);

export default client;
