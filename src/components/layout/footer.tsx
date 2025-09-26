"use client"

import { Facebook, Instagram, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#0056C6] text-white">
      <div className="max-w-[1110px] mx-auto px-4 py-8">
        {/* Logo */}
<div className="flex justify-center mb-8 relative">
          <img
            src="/dineline2.svg"
            alt="DINE LINE"
            className="h-16 w-auto transform -translate-y-16 bg-white rounded-lg px-2 py-1 shadow-lg"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-12 mb-6">
          <a href="#" className="text-sm font-medium hover:text-[#5CEFFA]">
            Nosotros
          </a>
          <a href="#" className="text-sm font-medium hover:text-[#5CEFFA]">
            Menú
          </a>
          <a href="#" className="text-sm font-medium hover:text-[#5CEFFA]">
            Mi Orden
          </a>
          <a href="#" className="text-sm font-medium hover:text-[#5CEFFA]">
            Contáctanos
          </a>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden space-y-3 mb-6">
          <div className="border-b border-white/20 pb-4">
            <button className="flex justify-center w-full">
              <span className="text-sm font-bold">Nosotros</span>
            </button>
          </div>
          <div className="border-b border-white/20 pb-4">
            <button className="flex justify-center w-full">
              <span className="text-sm font-bold">Menú</span>
            </button>
          </div>
          <div className="border-b border-white/20 pb-4">
            <button className="flex justify-center w-full">
              <span className="text-sm font-bold">Mi Orden</span>
            </button>
          </div>
          <div className="border-b border-white/20 pb-4">
            <button className="flex justify-center w-full">
              <span className="text-sm font-bold">Contáctanos</span>
            </button>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center mb-6">
          <p className="text-sm text-white/80">Sabores Auténticos, Momentos Inolvidables.</p>
        </div>

        {/* Action Buttons */}
        {/*<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button className="bg-[#5CEFFA] hover:bg-[#4DD8E8] text-black font-semibold px-8 py-3 rounded-xl">
            Ordene Ahora
          </Button>
          <Button className="bg-[#5CEFFA] hover:bg-[#4DD8E8] text-black font-semibold px-8 py-3 rounded-xl">
            Reserve Ahora
          </Button>
        </div>*/}

        {/* Social Media */}
        <div className="flex justify-center space-x-6 mb-3">
          <a
            href="#"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>

        {/* Social Media Text */}
        <div className="text-center">
          <p className="text-xs text-white/60">Síguenos En Nuestras Redes Sociales</p>
        </div>
      </div>
    </footer>
  )
}
