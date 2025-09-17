import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data || { message: error.message });
    }
    return Promise.reject({ message: error.message });
  }
);

export default client;
