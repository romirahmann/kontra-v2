import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "Tidak dapat menghubungi server",
      });
    }

    return Promise.reject({
      status: error.response.status,
      message: error.response.data?.message || "Terjadi kesalahan",
    });
  }
);

export default apiClient;
