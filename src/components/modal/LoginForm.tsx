import { useState } from "react"

export function LoginForm({ isRegister = false }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")

  const validateEmail = () => {
    // Add your email validation logic here
    if (email === "test@example.com" && password === "password") {
      setStatus("Login successful!")
    } else {
      setStatus("Invalid email or password.")
    }
  }

  return (
    <div className="w-full max-w-[600px]">
      <h1 className="text-3xl font-semibold text-gray-200 mb-4">{isRegister ? "Create an Account" : "Welcome Back"}</h1>
      <p className="font-medium text-lg text-gray-200 mb-6">
        {isRegister ? "Sign up to get started!" : "Welcome back! Please enter your details."}
      </p>
      <div className="flex flex-col gap-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-4 bg-gray-800 rounded-xl text-white focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-4 bg-gray-800 rounded-xl text-white focus:outline-none"
        />
      </div>
      <div className="mt-8 flex flex-col gap-y-4">
        <button
          onClick={validateEmail}
          className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg"
        >
          {isRegister ? "Sign up" : "Sign in"}
        </button>
        <button className="py-4 bg-gray-800 rounded-xl text-white font-bold text-lg">Sign in with Google</button>
      </div>
      <div className="mt-8 flex justify-center items-center">
        <p className="font-medium text-base text-gray-200">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
        </p>
        <button className="ml-2 font-medium text-base text-violet-500">{isRegister ? "Sign in" : "Sign up"}</button>
      </div>
      {status && <p className="mt-4 text-red-500">{status}</p>}
    </div>
  )
}

