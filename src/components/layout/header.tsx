"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, ShoppingCart, LogOut, Menu, RefreshCw, Loader2 } from "lucide-react"
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
  return (
    <header className="bg-[#0056C6] sticky top-0 z-50">
      <div className="max-w-[1110px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {showFullNavigation ? (
            // Full Navigation Header
            <div className="flex items-center justify-between w-full">
              {/* Left side - Navigation links */}
              <div className="flex items-center space-x-8">
                <a href="#" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Menú
                </a>
                <a href="#" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Nosotros
                </a>
              </div>

              {/* Center-Right - Logo */}
              <div className="flex items-center">
                <Link href="/home">
                  <img 
                    src="/DINE LINE.svg" 
                    alt="DINE LINE" 
                    className="h-20 w-auto"
                  />
                </Link>
              </div>

              {/* Right side - Navigation links */}
              <div className="flex items-center space-x-8">
                <a href="#" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Mi Orden
                </a>
                <a href="#" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Contáctanos
                </a>
              </div>

              {/* Mobile hamburger */}
              <div className="md:hidden">
                <Button variant="ghost" size="sm" className="text-white hover:text-[#5CEFFA]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            </div>
          ) : (
            // Simple Header
            <div className="flex items-center justify-between w-full">
              {/* Left side - Mobile hamburger or Desktop content */}
              <div className="flex items-center">
                {/* Mobile - Hamburger Menu */}
                {onHamburgerClick && (
                  <div className="md:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={onHamburgerClick}
                    >
                      <Menu className="w-6 h-6" />
                    </Button>
                  </div>
                )}

                {/* Desktop - Back button or Update button */}
                <div className="hidden md:flex items-center space-x-4">
                  {showBackButton && (
                    <Link href={backHref}>
                      <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                        <ArrowLeft className="w-4 h-4" />
                        <span>{backText}</span>
                      </Button>
                    </Link>
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
              </div>

              {/* Center-Right - Logo */}
              <div className="flex items-center">
                <Link href="/home">
                  <img 
                    src="/DINE LINE.svg" 
                    alt="DINE LINE" 
                    className="h-12 w-auto"
                  />
                </Link>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-2 md:space-x-4">
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
                  <div className="bg-white/10 px-3 py-1 rounded-lg flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{userInfo}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
