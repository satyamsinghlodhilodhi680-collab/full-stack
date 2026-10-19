import axios from "axios";

const api = axios.create({
    baseURL: "https://full-stack-ghsk.onrender.com",
    withCredentials: true
});

export default api;