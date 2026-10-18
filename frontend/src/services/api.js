
import axios from "axios";

const api = axios.create({
    baseURL: "https://gao-village.onrender.com/api",
    withCredentials: true
});

export default api;
