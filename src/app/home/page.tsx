'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shrimp, 
  User, 
  LogOut, 
  RefreshCw, 
  Phone, 
  CheckCircle, 
  Info, 
  Star, 
  Clock, 
  Wifi,
  Loader2,
  ShoppingCart
} from 'lucide-react'

// Tipo para la API
interface ApiMenuItem {
  name: string
  price: string
  description: string
}

// Tipo para nuestro menú local
interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  rating: number
  prepTime: string
}

// Menú estático de cevichería (se muestra por defecto)
const localMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Ceviche Clásico",
    description: "Pescado fresco marinado en limón con cebolla morada, ají limo y camote",
    price: 25.00,
    rating: 5,
    prepTime: "15-20 min"
  },
  {
    id: 2,
    name: "Ceviche Mixto", 
    description: "Pescado, pulpo, camarones y conchas negras en leche de tigre especial",
    price: 32.00,
    rating: 5,
    prepTime: "15-20 min"
  },
  {
    id: 3,
    name: "Tiradito Nikkei",
    description: "Cortes finos de pescado con salsa nikkei, palta y ajonjolí",
    price: 28.00,
    rating: 5,
    prepTime: "15-20 min"
  },
  {
    id: 4,
    name: "Arroz con Mariscos",
    description: "Arroz amarillo con mariscos frescos, culantro y ají amarillo",
    price: 35.00,
    rating: 5,
    prepTime: "15-20 min"
  },
  {
    id: 5,
    name: "Jalea Mixta",
    description: "Pescados y mariscos fritos acompañados de yuca, salsa criolla y ají",
    price: 38.00,
    rating: 5,
    prepTime: "15-20 min"
  },
  {
    id: 6,
    name: "Sudado de Pescado",
    description: "Pescado cocido al vapor con cebolla, tomate y culantro",
    price: 30.00,
    rating: 5,
    prepTime: "15-20 min"
  }
]

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(localMenuItems)
  const [isApiData, setIsApiData] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Verificar autenticación
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/")
    }
  }, [router])

  // Función para convertir datos de API a nuestro formato
  const convertApiDataToMenuItems = (apiData: ApiMenuItem[]): MenuItem[] => {
    return apiData.map((item, index) => {
      // Parsear los strings JSON anidados
      let name = item.name
      let price = '0'
      let description = item.description
      
      try {
        // Intentar parsear el name
        const nameData = JSON.parse(item.name)
        if (Array.isArray(nameData) && nameData.length > 0) {
          name = nameData[0].line || item.name
        }
      } catch (e) {
        // Si no se puede parsear, usar el valor original
      }
      
      try {
        // Intentar parsear el price
        const priceData = JSON.parse(item.price)
        if (Array.isArray(priceData) && priceData.length > 0) {
          price = priceData[0].price || item.price
        }
      } catch (e) {
        price = item.price
      }
      
      try {
        // Intentar parsear la description
        const descData = JSON.parse(item.description)
        if (Array.isArray(descData) && descData.length > 0) {
          description = descData[0].line || item.description
        }
      } catch (e) {
        // Si no se puede parsear, usar el valor original
      }
      
      return {
        id: index + 1,
        name: name,
        description: description,
        price: parseFloat(price.replace(/[^\d.-]/g, '')) || 0,
        rating: 5, // Rating por defecto
        prepTime: "15-20 min" // Tiempo por defecto
      }
    })
  }

  const handleViewMenu = async () => {
    setIsLoading(true)
    
    try {
      // PASO 1: Llamar a test-selenium
      setLoadingStep('Iniciando automatización Selenium...')
      
      const testResponse = await fetch('/api/auth/test-selenium', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const testResult = await testResponse.json()
      console.log('Test Selenium Result:', testResult)
      
      if (!testResult.success) {
        throw new Error(testResult.error || 'Error en test-selenium')
      }
      
      // Esperar un poco antes del siguiente paso
      await new Promise(resolve => setTimeout(resolve, 2000))

      // PASO 2: Llamar al menú
      setLoadingStep('Obteniendo datos del menú...')
      
      const menuResponse = await fetch('/api/menu/pizzas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const menuResult = await menuResponse.json()
      console.log('Menu Result:', menuResult)
      
      if (!menuResult.success) {
        throw new Error(menuResult.error || 'Error al obtener menú')
      }
      
      const apiMenuData: ApiMenuItem[] = menuResult.data
      
      // Convertir datos de API a nuestro formato
      if (Array.isArray(apiMenuData) && apiMenuData.length > 0) {
        const convertedItems = convertApiDataToMenuItems(apiMenuData)
        setMenuItems(convertedItems)
        setIsApiData(true)
        setLastUpdate(new Date())
        setLoadingStep('¡Menú actualizado con datos de la API!')
      } else {
        throw new Error('No se recibieron datos válidos de la API')
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
    } catch (error) {
      console.error('Error en API calls:', error)
      setLoadingStep(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      setMenuItems(localMenuItems)
      setIsApiData(false)
      await new Promise(resolve => setTimeout(resolve, 3000))
    } finally {
      setIsLoading(false)
      setLoadingStep('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    router.push("/")
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Actualizando Sistema</h3>
                <p className="text-gray-600 text-sm">{loadingStep}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full animate-pulse transition-all duration-500" 
                     style={{width: isLoading ? '75%' : '100%'}}></div>
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>Conectando con scrapper-dp2-fork.onrender.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shrimp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Cevichería DP2</h1>
                <p className="text-cyan-100">Los mejores sabores del mar peruano</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-white text-white hover:bg-white/10 flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={handleViewMenu}
              className="bg-white text-cyan-600 hover:bg-cyan-50 font-semibold px-6 py-3 rounded-xl flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualizar Menú (API)</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Hacer Pedido</span>
            </Button>
          </div>
          
          {/* Mostrar información de la API */}
          {isApiData && lastUpdate && (
            <div className="mt-4 bg-white/10 rounded-lg p-3 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
              <p className="text-sm text-cyan-100">
                Datos de API actualizados: {lastUpdate.toLocaleTimeString()} 
                ({menuItems.length} items)
              </p>
            </div>
          )}
          
          {!isApiData && (
            <div className="mt-4 bg-yellow-500/20 rounded-lg p-3 flex items-center space-x-2">
              <Info className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <p className="text-sm text-yellow-100">
                Mostrando menú local de cevichería. Haz click en "Actualizar Menú" para obtener datos externos.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isApiData ? 'Menú desde API' : 'Nuestra Carta'}
          </h2>
          <p className="text-gray-600">
            {isApiData ? 'Datos sincronizados desde sistema externo' : 'Los mejores sabores del mar peruano'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {item.name}
                  </CardTitle>
                  <Badge className={`font-semibold ${isApiData ? 'bg-green-600' : 'bg-cyan-600'} text-white`}>
                    {isApiData ? `$${item.price.toFixed(2)}` : `S/ ${item.price.toFixed(2)}`}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {renderStars(item.rating)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.prepTime}</span>
                  </div>
                </div>
                
                <Button className={`w-full mt-4 text-white font-semibold py-2 rounded-xl flex items-center justify-center space-x-2 ${
                  isApiData ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan-600 hover:bg-cyan-700'
                }`}>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar al pedido</span>
                </Button>
                
                {isApiData && (
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="text-xs border-green-200 text-green-700 flex items-center space-x-1 w-fit mx-auto">
                      <Wifi className="w-3 h-3" />
                      <span>API Data</span>
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
