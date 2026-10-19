import axios from "axios";

const api = axios.create({
    baseURL: "https://full-stack-ghsk.onrender.com/api",
    withCredentials: true
});

export default api;