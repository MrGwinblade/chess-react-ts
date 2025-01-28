import type React from "react"
import { useState } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../../hooks/useStore"
import { register, login } from "../../Services/api"

interface LoginFormProps {
    isRegister: boolean
    onClose: () => void
  }
  
  export const LoginForm: React.FC<LoginFormProps> = observer(({ isRegister, onClose }) => {
    const { authStore } = useStore()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
  
    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.(com|net|org)$/
      return regex.test(email)
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
  
      if (!validateEmail(email)) {
        setError("Invalid email format. Please use a valid email address.")
        return
      }
  
      try {
        if (isRegister) {
          await register(username, email, password)
          setError("Registration successful. Please log in.")
        } else {
          const data = await login(email, password)
          console.log("Token: "+ data)
          authStore.login(data)
          onClose()
        }
      } catch (error) {
        setError((error as Error).message || "An error occurred. Please try again.")
        console.log
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">{isRegister ? "Register" : "Login"}</h2>
        {isRegister && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full p-2 bg-gray-700 rounded text-white"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
    )
  })
