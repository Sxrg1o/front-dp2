"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, ShoppingCart, LogOut, Menu, RefreshCw, Loader2, X } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  showBackButton?: boolean
  backHref?: string
  backText?: string
  showCart?: boolean
  cartItems?: number
  showFavorite?: boolean
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  showLogout?: boolean
  onLogout?: () => void
  userInfo?: string
  showUpdateButton?: boolean
  onUpdateClick?: () => void
  isUpdating?: boolean
  onHamburgerClick?: () => void
  showFullNavigation?: boolean
}

export default function Header({
  showBackButton = false,
  backHref = "/home",
  backText = "Volver al menú",
  showCart = false,
  cartItems = 0,
  showFavorite = false,
  isFavorite = false,
  onFavoriteToggle,
  showLogout = false,
  onLogout,
  userInfo,
  showUpdateButton = false,
  onUpdateClick,
  isUpdating = false,
  onHamburgerClick,
  showFullNavigation = false
}: HeaderProps) {

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-[#0056C6] sticky top-0 z-50">
      <div className="max-w-[1110px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile - Logo a la izquierda */}
          <div className="md:hidden flex items-center">
            <Link href="/home">
              <img src="/DINE LINE.svg" alt="DINE LINE" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Header con grid balanceado */}
          <div className="hidden md:grid grid-cols-3 items-center h-16 w-full">
            {/* Left side - Navigation links */}
            <div className="flex justify-start space-x-8">
              <Link href="/menu" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                Menú
              </Link>
              <Link href="/about" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                Nosotros
              </Link>
            </div>

            {/* Logo al centro */}
            <div className="flex justify-center">
              <Link href="/home">
                <img src="/DINE LINE.svg" alt="DINE LINE" className="h-16 w-auto" />
              </Link>
            </div>

            {/* Right side - Navigation links */}
            <div className="flex justify-end space-x-8">
              <Link href="/order" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                Mi Orden
              </Link>
              <Link href="/contact" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                Contáctanos
              </Link>
            </div>
          </div>

          {/* Acciones Desktop */}
          <div className="hidden md:flex items-center space-x-4 absolute right-32">
            {showFavorite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFavoriteToggle}
                className={`text-white hover:bg-white/10 ${isFavorite ? "text-red-300" : ""}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            )}

            {showCart && (
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-[#0056C6] text-xs flex items-center justify-center font-bold">
                    {cartItems}
                  </span>
                )}
              </Button>
            )}

            {showLogout && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}

            {userInfo && (
              <div className="bg-white/10 px-3 py-1 rounded-lg flex items-center">
                <span className="text-sm font-medium text-white">{userInfo}</span>
              </div>
            )}

            {showUpdateButton && (
              <Button
                onClick={onUpdateClick}
                className="bg-white/10 hover:bg-white/20 text-white flex items-center space-x-2"
                disabled={isUpdating}
              >
                {isUpdating ? (
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
            )}
          </div>

          {/* Hamburguesa - Mobile */}
          <div className="md:hidden ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú Mobile alineado a la derecha */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0056C6] text-white px-6 pb-4 space-y-3 text-right">
          <Link href="/menu" className="block hover:text-[#5CEFFA]">Menú</Link>
          <Link href="/about" className="block hover:text-[#5CEFFA]">Nosotros</Link>
          <Link href="/order" className="block hover:text-[#5CEFFA]">Mi Orden</Link>
          <Link href="/contact" className="block hover:text-[#5CEFFA]">Contáctanos</Link>
        </div>
      )}
    </header>
  )
}