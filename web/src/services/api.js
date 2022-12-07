import axios from "axios";
import { clearAll } from "../utils/storage";

const axiosPrivate = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      setTimeout(() => {
        window.location.replace("http://localhost:3000");
        clearAll();
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default axiosPrivate;
