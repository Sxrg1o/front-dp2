"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🐟</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">DP2</h1>
              <p className="text-sm text-gray-600">Cevichería</p>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Bienvenido de vuelta
          </CardTitle>
          <CardDescription className="text-gray-600">
            Ingresa tus credenciales para acceder al sistema de gestión
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-11 border-gray-200 hover:bg-gray-50"
            >
              <span className="mr-2">G</span>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="h-11 border-gray-200 hover:bg-gray-50"
            >
              <span className="mr-2">T</span>
              Twitter
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Regístrate aquí
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
