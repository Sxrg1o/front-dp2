'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image' 
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react'

// --- TIPOS DE DATOS ---
type Option = {
  id: string;
  name: string;
  price: number;
};

type OptionGroup = {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  isRequired: boolean;
  maxSelection?: number;
  options: Option[];
};

type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string; 
  optionGroups: OptionGroup[];
};

// --- DATOS DE EJEMPLO (ESTO VENDRÍA DE  API) ---
const productData: { [key: string]: Product } = {
  "1": {
    id: "1",
    name: "Ceviche Clásico",
    description: "Pescado fresco marinado en limón con cebolla roja, ají limo, culantro y camote.",
    basePrice: 28.50,
    imageUrl: "/placeholder.svg",
    optionGroups: [
      {
        id: "pescado",
        title: "Elige tu pescado",
        type: "radio",
        isRequired: true,
        options: [
          { id: "lenguado", name: "Lenguado", price: 0 },
          { id: "corvina", name: "Corvina", price: 3.00 },
          { id: "mero", name: "Mero", price: 5.00 },
        ],
      },
      {
        id: "acompanamientos",
        title: "Acompañamientos",
        type: "checkbox",
        isRequired: false,
        options: [
          { id: "camote-extra", name: "Camote extra", price: 2.00 },
          { id: "choclo", name: "Choclo", price: 2.50 },
          { id: "yuca", name: "Yuca frita", price: 2.00 },
          { id: "cancha", name: "Cancha serrana", price: 1.50 },
        ],
      },
      {
        id: "extras",
        title: "Ingredientes extra",
        type: "checkbox",
        isRequired: false,
        maxSelection: 2,
        options: [
          { id: "pulpo", name: "Pulpo", price: 8.00 },
          { id: "camarones", name: "Camarones", price: 10.00 },
          { id: "conchas-negras", name: "Conchas negras", price: 12.00 },
        ],
      },
      {
        id: "aji",
        title: "Nivel de ají",
        type: "radio",
        isRequired: true,
        options: [
          { id: "sin-aji", name: "Sin ají", price: 0 },
          { id: "normal", name: "Normal", price: 0 },
          { id: "fuerte", name: "Fuerte", price: 0 },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    name: "Ceviche Mixto",
    description: "Pescado, pulpo y camarones marinados en limón con cebolla roja, ají limo y choclo.",
    basePrice: 32.00,
    imageUrl: "/placeholder.svg",
    optionGroups: [
      {
        id: "aji",
        title: "Nivel de ají",
        type: "radio",
        isRequired: true,
        options: [
          { id: "sin-aji", name: "Sin ají", price: 0 },
          { id: "normal", name: "Normal", price: 0 },
          { id: "fuerte", name: "Fuerte", price: 0 },
        ],
      },
      {
        id: "acompanamientos",
        title: "Acompañamientos",
        type: "checkbox",
        isRequired: false,
        options: [
          { id: "camote-extra", name: "Camote extra", price: 2.00 },
          { id: "choclo", name: "Choclo", price: 2.50 },
          { id: "chifles", name: "Chifles (plátano frito)", price: 2.50 },
        ],
      },
    ],
  },
};

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = productData[params.id];

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Producto no encontrado</CardTitle>
            <CardDescription>
              El producto que buscas no existe o no está disponible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ProductCustomization product={product} />;
}


// --- COMPONENTE DE CLIENTE PARA LA INTERACTIVIDAD ---
function ProductCustomization({ product }: { product: Product }) {
  // --- ESTADO ---
  const [quantity, setQuantity] = useState(1);
  const [specialComments, setSpecialComments] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});

  // --- LÓGICA DE CÁLCULO Y VALIDACIÓN  ---
  const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const totalPrice = useMemo(() => {
    let optionsPrice = 0;
    for (const groupId in selectedOptions) {
      const group = product.optionGroups.find(g => g.id === groupId);
      if (!group) continue;
      const selection = selectedOptions[groupId];
      if (Array.isArray(selection)) {
        selection.forEach(optionId => {
          const option = group.options.find(o => o.id === optionId);
          if (option) optionsPrice += option.price;
        });
      } else {
        const option = group.options.find(o => o.id === selection);
        if (option) optionsPrice += option.price;
      }
    }
    return (product.basePrice + optionsPrice) * quantity;
  }, [selectedOptions, quantity, product]);

  const validationError = useMemo(() => {
    const missingRequirement = product.optionGroups.find(
      (group) => group.isRequired && (!selectedOptions[group.id] || selectedOptions[group.id].length === 0)
    );
    if (missingRequirement) {
      return `Por favor, elige una opción para "${missingRequirement.title}"`;
    }
    return null;
  }, [selectedOptions, product.optionGroups]);

  // --- MANEJADORES DE EVENTOS  ---
  const handleRadioChange = (groupId: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [groupId]: value }));
  };
  const handleCheckboxChange = (groupId: string, optionId: string, checked: boolean) => {
    const group = product.optionGroups.find(g => g.id === groupId)!;
    const currentSelection = (selectedOptions[groupId] as string[] || []);
    let newSelection: string[];
    if (checked) {
      if (group.maxSelection && currentSelection.length >= group.maxSelection) { return; }
      newSelection = [...currentSelection, optionId];
    } else {
      newSelection = currentSelection.filter(id => id !== optionId);
    }
    setSelectedOptions(prev => ({ ...prev, [groupId]: newSelection }));
  };
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  const handleAddToCart = () => {
    if (validationError) return;
    console.log("Agregando al carrito:", { productId: product.id, quantity, selectedOptions, specialComments, totalPrice, });
    alert(`${product.name} x${quantity} agregado al carrito!`);
  }

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="bg-gradient-to-br from-cyan-400 to-blue-500 min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <header className="mb-4">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Volver al Menú</span>
          </Link>
        </header>

        <main className="glass-effect rounded-2xl shadow-2xl shadow-black/20 overflow-hidden text-slate-800">
          <div className="p-6 sm:p-8">

            {/* INFORMACIÓN DEL PRODUCTO */}
            <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="w-32 h-32 flex-shrink-0 relative rounded-lg overflow-hidden shadow-lg border-4 border-white/50">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>
                <p className="text-slate-600 mt-2">{product.description}</p>
                <p className="text-2xl font-bold text-slate-800 mt-3">{currencyFormatter.format(product.basePrice)}</p>
              </div>
            </section>

            {/* OPCIONES DEL PRODUCTO */}
            <div className="space-y-6">
              {product.optionGroups.map((group) => (
                <Card key={group.id} className="bg-white/60 border-slate-200/50 shadow-sm">
                  <CardHeader className="bg-white/50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-slate-800">{group.title}</CardTitle>
                      <Badge className={group.isRequired ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}>
                        {group.isRequired ? "Obligatorio" : "Opcional"}
                      </Badge>
                    </div>
                    {group.type !== 'radio' && group.maxSelection && (
                      <CardDescription>
                        Selecciona hasta {group.maxSelection} {group.maxSelection > 1 ? 'opciones' : 'opción'}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4">
                    {group.type === 'radio' ? (
                      <RadioGroup onValueChange={(value) => handleRadioChange(group.id, value)}>
                        <div className="space-y-2">
                          {group.options.map(option => (
                            <div key={option.id} className="flex items-center justify-between p-3 rounded-md transition-colors hover:bg-cyan-100/50">
                              <div className="flex items-center">
                                <RadioGroupItem value={option.id} id={`${group.id}-${option.id}`} />
                                <Label htmlFor={`${group.id}-${option.id}`} className="pl-3 font-medium cursor-pointer text-base text-slate-700">
                                  {option.name}
                                </Label>
                              </div>
                              <span className="text-sm font-semibold text-slate-500">
                                {option.price > 0 ? `+${currencyFormatter.format(option.price)}` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="space-y-2">
                        {group.options.map(option => (
                          <div key={option.id} className="flex items-center justify-between p-3 rounded-md transition-colors hover:bg-cyan-100/50">
                            <div className="flex items-center">
                              <Checkbox
                                id={`${group.id}-${option.id}`}
                                onCheckedChange={(checked) => handleCheckboxChange(group.id, option.id, !!checked)}
                                disabled={
                                  !(selectedOptions[group.id] as string[] || []).includes(option.id) &&
                                  (selectedOptions[group.id] as string[] || []).length >= (group.maxSelection || Infinity)
                                }
                              />
                              <Label htmlFor={`${group.id}-${option.id}`} className="pl-3 font-medium cursor-pointer text-base text-slate-700">
                                {option.name}
                              </Label>
                            </div>
                            <span className="text-sm font-semibold text-slate-500">
                              {option.price > 0 ? `+${currencyFormatter.format(option.price)}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Comentarios especiales */}
            <Card className="mt-8 bg-white/60 border-slate-200/50 shadow-sm">
              <CardHeader className="bg-white/50">
                <CardTitle className="text-lg font-semibold text-slate-800">Comentarios especiales</CardTitle>
                <CardDescription>Indícanos cualquier detalle adicional para tu plato.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Textarea
                  placeholder="Ej: Sin culantro, con más limón, etc..."
                  value={specialComments}
                  onChange={(e) => setSpecialComments(e.target.value)}
                  className="bg-white/80 focus:bg-white"
                />
              </CardContent>
            </Card>

            <Separator className="my-8 bg-white/30" />
            {/* cantidad */}
            <footer className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl text-slate-800">Cantidad</span>
                <div className="flex items-center gap-1 bg-white/70 rounded-full p-1 shadow-inner">
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="w-10 text-center font-bold text-xl text-slate-900">{quantity}</span>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleQuantityChange(1)}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {validationError && (
                <p className="text-sm text-white bg-red-500/90 p-3 rounded-lg text-center font-semibold shadow">
                  {validationError}
                </p>
              )}
              {/* Botón de agregar al carrito */}
              <Button
                size="lg"
                className="w-full text-lg font-bold h-14 bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
                disabled={!!validationError}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                Agregar ({currencyFormatter.format(totalPrice)})
              </Button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
