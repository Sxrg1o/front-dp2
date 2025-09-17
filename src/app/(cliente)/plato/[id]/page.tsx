import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import './plate.css'

// Sample data - esto vendría de una API en producción
const plateData = {
  "1": {
    id: "1",
    name: "Ceviche Clásico",
    description: "Pescado fresco marinado en limón con cebolla roja, ají limo, culantro y camote",
    price: 28.50,
    category: "Ceviches",
    available: true,
    isPopular: true,
    preparationTime: 15,
    rating: 4.8,
    reviewCount: 156
  },
  "2": {
    id: "2",
    name: "Ceviche Mixto",
    description: "Pescado, pulpo y camarones marinados en limón con cebolla roja, ají limo y choclo",
    price: 32.00,
    category: "Ceviches",
    available: true,
    isPopular: true,
    preparationTime: 18,
    rating: 4.6,
    reviewCount: 89
  }
}

interface PlatePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PlatePage({ params }: PlatePageProps) {
  const { id } = await params
  const plate = plateData[id as keyof typeof plateData]

  if (!plate) {
    return (
      <div className="plate-page">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-muted-foreground mb-4">
              Plato no encontrado
            </h1>
            <p className="text-muted-foreground mb-6">
              El plato que buscas no está disponible en este momento.
            </p>
            <Link href="/">
              <Button>Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="plate-page">
      {/* Header con navegación */}
      <header className="plate-header">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Inicio
        </Link>
        
        <Badge variant={plate.available ? "secondary" : "destructive"}>
          {plate.available ? "Disponible" : "Agotado"}
        </Badge>
      </header>

      {/* Contenido principal */}
      <div className="plate-content">
        {/* Columna principal - Detalles */}
        <div className="plate-details">
          
          {/* Imagen del plato */}
          <section className="plate-image">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">[IMAGEN DEL CEVICHE]</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Información básica */}
          <section className="plate-info">
            <Card>
              <CardHeader>
                <CardTitle>{plate.name}</CardTitle>
                <CardDescription>{plate.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ingredientes:</h4>
                    <p className="text-muted-foreground">[Pescado fresco, limón, cebolla roja, ají limo, culantro]</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Opciones de personalización */}
          <section className="plate-options">
            <Card>
              <CardHeader>
                <CardTitle>Personaliza tu pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Selección de Proteína (Radio) */}
                  <div className="protein-selection">
                    <h4 className="font-semibold mb-3">Elige tu pescado:</h4>
                    <div className="space-y-2">
                      <label className="protein-option">
                        <input type="radio" name="protein" value="lenguado" defaultChecked />
                        <span className="option-content">
                          <span className="option-name">Lenguado</span>
                          <span className="option-price">Base</span>
                        </span>
                      </label>
                      <label className="protein-option">
                        <input type="radio" name="protein" value="corvina" />
                        <span className="option-content">
                          <span className="option-name">Corvina</span>
                          <span className="option-price">+S/. 3.00</span>
                        </span>
                      </label>
                      <label className="protein-option">
                        <input type="radio" name="protein" value="mero" />
                        <span className="option-content">
                          <span className="option-name">Mero</span>
                          <span className="option-price">+S/. 5.00</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Acompañamientos (Checkbox) */}
                  <div className="sides-selection">
                    <h4 className="font-semibold mb-3">Acompañamientos:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="side-option">
                        <input type="checkbox" />
                        <span className="option-content">
                          <span className="option-name">Camote</span>
                          <span className="option-price">+S/. 2.00</span>
                        </span>
                      </label>
                      <label className="side-option">
                        <input type="checkbox" />
                        <span className="option-content">
                          <span className="option-name">Choclo</span>
                          <span className="option-price">+S/. 2.50</span>
                        </span>
                      </label>
                      <label className="side-option">
                        <input type="checkbox" />
                        <span className="option-content">
                          <span className="option-name">Yuca</span>
                          <span className="option-price">+S/. 2.00</span>
                        </span>
                      </label>
                      <label className="side-option">
                        <input type="checkbox" />
                        <span className="option-content">
                          <span className="option-name">Cancha</span>
                          <span className="option-price">+S/. 1.50</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Ingredientes Extra (Checkbox) */}
                  <div className="extras-selection">
                    <h4 className="font-semibold mb-3">Ingredientes extra:</h4>
                    <div className="space-y-2">
                      <label className="extra-option">
                        <input type="checkbox" />
                        <span className="option-content">
                          <span className="option-name">Pulpo</span>
                          <span className="option-price">+S/. 8.00</span>
                        </span>
                      </label>
                      <label className="extra-option">
                        <input type="checkbox" />
                        <span className="option-content">
                          <span className="option-name">Camarones</span>
                          <span className="option-price">+S/. 10.00</span>
                        </span>
                      </label>
                      <label className="extra-option">
                        <input type="checkbox" />
                        <span className="option-content">
                          <span className="option-name">Conchas negras</span>
                          <span className="option-price">+S/. 12.00</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Nivel de Ají (Radio) */}
                  <div className="spice-selection">
                    <h4 className="font-semibold mb-3">Nivel de ají:</h4>
                    <div className="spice-options">
                      <label className="spice-option">
                        <input type="radio" name="spice" value="sin-aji" defaultChecked />
                        <span className="spice-label">Sin ají</span>
                      </label>
                      <label className="spice-option">
                        <input type="radio" name="spice" value="normal" />
                        <span className="spice-label">Normal</span>
                      </label>
                      <label className="spice-option">
                        <input type="radio" name="spice" value="fuerte" />
                        <span className="spice-label">Fuerte</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Barra lateral - Precio y acciones */}
        <aside className="plate-sidebar">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl">{plate.name}</CardTitle>
              <CardDescription>{plate.category}</CardDescription>
            </CardHeader>
            <CardContent className="plate-actions space-y-4">
              {/* Precio */}
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-green-600">
                  S/. {plate.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plate.preparationTime} min
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {plate.isPopular && (
                  <Badge className="bg-orange-500">Popular</Badge>
                )}
              </div>

              {/* Botones */}
              <Button 
                className="w-full" 
                size="lg"
                disabled={!plate.available}
              >
                {plate.available ? "Agregar al Carrito" : "No Disponible"}
              </Button>

              <Button variant="outline" className="w-full" disabled>
                Ver Carrito (No disponible)
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
