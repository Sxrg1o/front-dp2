'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  ShoppingCart,
  Search,
  Menu,
  Heart
} from 'lucide-react'
import Link from 'next/link'

// Tipo para la API
interface ApiMenuItem {
  name: string
  price: string
  description: string
  image: string // Agregar este campo
}

// Tipo para nuestro menú local
interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  rating: number
  prepTime: string
  image: string
  category: string
  popular: boolean
}

// Menú estático de cevichería (se muestra por defecto)
const localMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Ceviche Clásico",
    description: "Pescado fresco marinado en limón con cebolla morada, ají limo y camote",
    price: 25.00,
    rating: 4.9,
    prepTime: "15 min",
    image: "/fresh-ceviche-with-red-onions-and-sweet-potato.jpg",
    category: "Ceviches",
    popular: true
  },
  {
    id: 2,
    name: "Ceviche Mixto", 
    description: "Pescado, pulpo, camarones y conchas negras en leche de tigre especial",
    price: 32.00,
    rating: 4.8,
    prepTime: "18 min",
    image: "/mixed-seafood-ceviche-with-shrimp-and-octopus.jpg",
    category: "Ceviches",
    popular: true
  },
  {
    id: 3,
    name: "Tiradito Nikkei",
    description: "Cortes finos de pescado con salsa nikkei, palta y ajonjolí",
    price: 28.00,
    rating: 4.7,
    prepTime: "12 min",
    image: "/tiradito-nikkei-with-thin-fish-slices-and-sesame.jpg",
    category: "Tiraditos",
    popular: false
  },
  {
    id: 4,
    name: "Arroz con Mariscos",
    description: "Arroz amarillo con mariscos frescos, culantro y ají amarillo",
    price: 35.00,
    rating: 4.6,
    prepTime: "25 min",
    image: "/peruvian-seafood-rice-with-cilantro.jpg",
    category: "Arroces",
    popular: false
  },
  {
    id: 5,
    name: "Causa Limeña",
    description: "Papa amarilla con pollo, palta y mayonesa casera",
    price: 24.00,
    rating: 4.5,
    prepTime: "10 min",
    image: "/causa-limena-with-yellow-potato-and-avocado.jpg",
    category: "Entradas",
    popular: false
  },
  {
    id: 6,
    name: "Leche de Tigre",
    description: "El jugo concentrado del ceviche con mariscos y cancha",
    price: 18.00,
    rating: 4.8,
    prepTime: "5 min",
    image: "/leche-de-tigre-with-seafood-and-corn-nuts.jpg",
    category: "Bebidas",
    popular: true
  }
]

const categories = ["Todos", "Ceviches", "Tiraditos", "Arroces", "Entradas", "Bebidas"]

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(localMenuItems)
  const [isApiData, setIsApiData] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<number[]>([])
  const [favorites, setFavorites] = useState<number[]>([])

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
      let image = "/placeholder.jpg" // Imagen por defecto
      
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
      
      try {
        // Intentar parsear la image - AQUÍ ESTÁ EL FIX
        // Reemplazar comillas simples por dobles para hacer JSON válido
        const imageJsonString = item.image.replace(/'/g, '"')
        const imageData = JSON.parse(imageJsonString)
        if (imageData && imageData.url) {
          image = imageData.url
        }
      } catch (e) {
        console.error("Error parsing image URL:", e, "for item:", item.image)
        // Si falla, usar imagen local como fallback
        image = localMenuItems[index % localMenuItems.length]?.image || "/placeholder.jpg"
      }
      
      return {
        id: index + 1,
        name: name,
        description: description,
        price: parseFloat(price.replace(/[^\d.-]/g, '')) || 0,
        rating: 4.5 + Math.random() * 0.5, // Rating aleatorio entre 4.5-5.0
        prepTime: "15-20 min",
        image: image, // Usar la imagen de la API
        category: localMenuItems[index % localMenuItems.length]?.category || "Ceviches",
        popular: Math.random() > 0.7 // 30% chance de ser popular
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

  const addToCart = (dishId: number) => {
    setCart((prev) => [...prev, dishId])
  }

  const toggleFavorite = (dishId: number) => {
    setFavorites((prev) => (prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]))
  }

  const filteredDishes = menuItems.filter((dish) => {
    const matchesCategory = selectedCategory === "Todos" || dish.category === selectedCategory
    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Shrimp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cyan-600">Cevichería DP2</h1>
                <p className="text-sm text-muted-foreground">Los mejores sabores del mar peruano</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleViewMenu}
                className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center space-x-2"
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
                    <span>Actualizar Menú</span>
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-cyan-600">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-cyan-500 to-teal-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Los Mejores Ceviches
            <span className="block text-yellow-300">del Perú</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto text-pretty">
            Ingredientes frescos del océano, preparados con la tradición y pasión de la cocina peruana
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-cyan-600 hover:bg-cyan-50">
              Ver Carta Completa
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Phone className="w-4 h-4 mr-2" />
              Hacer Pedido
            </Button>
          </div>
        </div>
      </section>

      {/* API Status */}
      {isApiData && lastUpdate && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700">
              Datos de API actualizados: {lastUpdate.toLocaleTimeString()} 
              ({menuItems.length} items)
            </p>
          </div>
        </div>
      )}
      
      {!isApiData && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              Mostrando menú local de cevichería. Haz click en "Actualizar Menú" para obtener datos externos.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar platos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-cyan-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isApiData ? 'Menú desde API' : 'Nuestra Carta'}
            </h2>
            <p className="text-gray-600">
              {isApiData ? 'Datos sincronizados desde sistema externo' : 'Los mejores sabores del mar peruano'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <Card key={dish.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-2xl overflow-hidden group">
                <div className="relative">
                  <img
                    src={dish.image || "/placeholder.svg"}
                    alt={dish.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onError={(e) => {
                      // Si la imagen falla, usar una imagen local
                      const target = e.target as HTMLImageElement
                      target.src = localMenuItems[dish.id % localMenuItems.length]?.image || "/placeholder.jpg"
                    }}
                  />
                  {dish.popular && (
                    <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">Popular</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                    onClick={() => toggleFavorite(dish.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${favorites.includes(dish.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </Button>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg group-hover:text-cyan-600 transition-colors cursor-pointer">
                        {dish.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {dish.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-600">
                        {isApiData ? `$${dish.price.toFixed(2)}` : `S/ ${dish.price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-4 text-pretty">{dish.description}</CardDescription>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{dish.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{dish.prepTime}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button 
                    className={`w-full text-white font-semibold py-2 rounded-xl flex items-center justify-center space-x-2 ${
                      isApiData ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan-600 hover:bg-cyan-700'
                    }`}
                    onClick={() => addToCart(dish.id)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar al Carrito</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">500+</div>
              <p className="text-muted-foreground">Clientes Satisfechos</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">4.9</div>
              <p className="text-muted-foreground">Calificación Promedio</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">15min</div>
              <p className="text-muted-foreground">Tiempo Promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyan-600 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Cevichería DP2</h3>
              <p className="text-white/80">
                La mejor experiencia gastronómica peruana, con ingredientes frescos y sabores auténticos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-white/80 mb-2">📍 Av. Larco 123, Miraflores</p>
              <p className="text-white/80 mb-2"> +51 1 234-5678</p>
              <p className="text-white/80">✉️ info@cevicheriadp2.pe</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Horarios</h4>
              <p className="text-white/80 mb-2">Lun - Dom: 11:00 AM - 10:00 PM</p>
              <p className="text-white/80">Delivery hasta las 9:30 PM</p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/60">© 2024 Cevichería DP2. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
