import axios from "axios";

let baseURL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
});

export default apiClient;
