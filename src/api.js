import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5000/api", // change port if backend runs elsewhere
  baseURL: "https://casedop.onrender.com/api",
});

export default api;
