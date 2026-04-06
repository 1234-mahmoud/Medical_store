import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;


/*
axios.create(...) → creates a custom Axios client
baseURL → sets a default base URL for all requests
API → this instance can be reused anywhere in your project
*/