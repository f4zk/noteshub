import axios from "axios";

let envUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").trim().replace(/\/+$/, "");
if (envUrl.endsWith("/api")) {
  envUrl = envUrl.slice(0, -4);
}
export const API_BASE_URL = envUrl;
const TOKEN_KEY = "token";
const USER_KEY = "user";
const THEME_KEY = "theme";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function clearAuth() {
  clearToken();
  localStorage.removeItem(USER_KEY);
}

export function getThemePreference() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function setThemePreference(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

