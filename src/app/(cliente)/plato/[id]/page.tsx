"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus } from "lucide-react"

interface SideOption {
  id: string
  name: string
  price: number
  label?: string
}

interface ExtraOption {
  id: string
  name: string
  price: number
}

export default function ProductCustomization() {
  const [selectedSide, setSelectedSide] = useState<string>("")
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [comments, setComments] = useState("")
  const [showMaxExtrasWarning, setShowMaxExtrasWarning] = useState(false)

  const basePrice = 20000
  const product = {
    name: "Hamburguesa con Queso",
    description: "Carne de res, queso cheddar, lechuga, tomate y cebolla",
    price: basePrice,
    image: "/classic-cheeseburger.png",
  }

  const sideOptions: SideOption[] = [
    { id: "papas-fritas", name: "Papas fritas", price: 0, label: "Gratis" },
    { id: "papas-doradas", name: "Papas doradas", price: 2000 },
    { id: "papas-camote", name: "Papas de camote", price: 3000 },
  ]

  const extraOptions: ExtraOption[] = [
    { id: "queso-extra", name: "Queso extra", price: 2500 },
    { id: "tocineta", name: "Tocineta", price: 4000 },
    { id: "aguacate", name: "Aguacate", price: 3500 },
  ]

  const handleExtraChange = (extraId: string, checked: boolean) => {
    if (checked) {
      if (selectedExtras.length >= 3) {
        setShowMaxExtrasWarning(true)
        setTimeout(() => setShowMaxExtrasWarning(false), 3000)
        return
      }
      setSelectedExtras([...selectedExtras, extraId])
    } else {
      setSelectedExtras(selectedExtras.filter((id) => id !== extraId))
    }
  }

  const calculateTotal = () => {
    let total = basePrice

    // Add side price
    const selectedSideOption = sideOptions.find((side) => side.id === selectedSide)
    if (selectedSideOption) {
      total += selectedSideOption.price
    }

    // Add extras prices
    selectedExtras.forEach((extraId) => {
      const extra = extraOptions.find((e) => e.id === extraId)
      if (extra) {
        total += extra.price
      }
    })

    return total * quantity
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  const isAddToCartEnabled = selectedSide !== ""

  return (
    <div className="min-h-screen bg-[#FAFCFE]">
      {/* Header */}
      <header className="bg-white border-b border-[#ECF1F4] sticky top-0 z-50">
        <div className="max-w-[1110px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <span className="text-sm text-[#8C8CA1]">Personalizar producto</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium hover:text-[#0056C6]">
                Menú
              </a>
              <a href="#" className="text-sm font-medium hover:text-[#0056C6]">
                Nosotros
              </a>
              <a href="#" className="text-sm font-medium hover:text-[#0056C6]">
                Mi Orden
              </a>
              <a href="#" className="text-sm font-medium hover:text-[#0056C6]">
                Contáctanos
              </a>
            </nav>
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1110px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Desktop: 8 cols, Mobile: full width */}
          <div className="lg:col-span-8 space-y-6">
            {/* Product Summary Card */}
            <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
              <div className="flex items-start space-x-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-20 h-20 rounded-[30px] object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-gray-900 mb-1">{product.name}</h2>
                  <p className="text-sm text-[#8C8CA1] mb-2">{product.description}</p>
                  <p className="text-base font-semibold text-gray-900">{formatPrice(product.price)}</p>
                </div>
              </div>
            </Card>

            {/* Side Selection Card */}
            <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Selecciona tu acompañamiento</h3>
                <Badge variant="secondary" className="bg-[#ECF1F4] text-[#8C8CA1] text-xs">
                  Obligatorio
                </Badge>
              </div>
              <p className="text-sm text-[#8C8CA1] mb-4">Selecciona 1 opción</p>

              <RadioGroup value={selectedSide} onValueChange={setSelectedSide} className="space-y-3">
                {sideOptions.map((option, index) => (
                  <div key={option.id}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                          {option.name}
                        </Label>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {option.label || (option.price > 0 ? `+${formatPrice(option.price)}` : "Gratis")}
                      </div>
                    </div>
                    {index < sideOptions.length - 1 && <div className="border-b border-[#ECF1F4]"></div>}
                  </div>
                ))}
              </RadioGroup>
            </Card>

            {/* Extras Card */}
            <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Agrega más sabor a tu orden</h3>
                <Badge variant="secondary" className="bg-[#ECF1F4] text-[#8C8CA1] text-xs">
                  Opcional
                </Badge>
              </div>
              <p className="text-sm text-[#8C8CA1] mb-4">Selecciona hasta 3 opciones (opcional)</p>

              {showMaxExtrasWarning && (
                <div className="mb-4 p-3 bg-[#ECF1F4] rounded-lg">
                  <p className="text-sm text-[#8C8CA1]">Máximo 3 opciones</p>
                </div>
              )}

              <div className="space-y-3">
                {extraOptions.map((option, index) => (
                  <div key={option.id}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={option.id}
                          checked={selectedExtras.includes(option.id)}
                          onCheckedChange={(checked) => handleExtraChange(option.id, checked as boolean)}
                        />
                        <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                          {option.name}
                        </Label>
                      </div>
                      <div className="text-sm font-medium text-gray-900">+{formatPrice(option.price)}</div>
                    </div>
                    {index < extraOptions.length - 1 && <div className="border-b border-[#ECF1F4]"></div>}
                  </div>
                ))}
              </div>
            </Card>

            {/* Comments Card */}
            <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Comentarios especiales</h3>
                <Badge variant="secondary" className="bg-[#ECF1F4] text-[#8C8CA1] text-xs">
                  Opcional
                </Badge>
              </div>
              <p className="text-sm text-[#8C8CA1] mb-4">Agregamos cualquier modificación especial para tu plato</p>

              <Textarea
                placeholder="Ej: Sin cebolla, salsa aparte, bien cocido, etc…"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                maxLength={200}
                className="min-h-[100px] resize-none border-[#ECF1F4] focus:border-[#5CEFFA] focus:ring-[#5CEFFA]"
              />
              <p className="text-xs text-[#8C8CA1] mt-2">{comments.length}/200 caracteres</p>
            </Card>
          </div>

          {/* Right Column - Desktop: 4 cols, Mobile: full width */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Card className="p-6 bg-white border border-[#ECF1F4] rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-base font-semibold text-gray-900">{formatPrice(product.price)}</p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-900">Cantidad</span>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0 border-[#ECF1F4] bg-transparent"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0 border-[#ECF1F4] bg-transparent"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Validation Banner */}
                {!isAddToCartEnabled && (
                  <div className="mb-4 p-3 bg-[#ECF1F4] rounded-lg">
                    <p className="text-sm text-[#8C8CA1]">
                      Faltan selecciones obligatorias: Selecciona tu acompañamiento
                    </p>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  className={`w-full h-12 text-base font-semibold rounded-xl ${
                    isAddToCartEnabled
                      ? "bg-[#0056C6] hover:bg-[#004299] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                  }`}
                  disabled={!isAddToCartEnabled}
                >
                  Agregar al carrito – {formatPrice(calculateTotal())}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
