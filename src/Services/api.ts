import axios from "axios"

const API_URL = "https://localhost:7015/api/User"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

export const register = async (userName: string, email: string, password: string) => {
  try {
    console.log({ userName, email, password })
    const response = await api.post("/register", { userName, email, password })
    //const response = await api.get("/custom-response")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
        // Теперь TypeScript знает, что error является ошибкой axios
        throw error.response?.data || "An error occurred during login.";
      } else {
        // Обработка других типов ошибок
        throw "An unexpected error occurred.";
      }
  }
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
        // Теперь TypeScript знает, что error является ошибкой axios
        throw error.response?.data + "asd" || "An error occurred during login.";
      } else {
        // Обработка других типов ошибок
        throw "An unexpected error occurred.";
      }
  }
}

export const logout = async () => {
  try {
    await api.post("/logout")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

export default api

