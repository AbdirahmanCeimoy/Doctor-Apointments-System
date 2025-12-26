"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Stethoscope, Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Contact Us", href: "#contact" },
  ]

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200" 
        : "bg-white/80 backdrop-blur-sm shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Stethoscope className="relative h-9 w-9 text-blue-600 group-hover:text-indigo-700 transition-colors" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MediCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            <Button
              onClick={() => router.push("/login")}
              variant="ghost"
              className="ml-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/signup")}
              className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="transition-transform duration-300"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="border-t bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 hover:translate-x-2"
            >
              {item.name}
            </button>
          ))}
            <Button
              onClick={() => {
                router.push("/login")
                setMobileMenuOpen(false)
              }}
              variant="outline"
              className="w-full mt-2 border-2 border-gray-300 hover:border-blue-600"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                router.push("/signup")
                setMobileMenuOpen(false)
              }}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              Sign Up
            </Button>
        </div>
      </div>
    </nav>
  )
}

