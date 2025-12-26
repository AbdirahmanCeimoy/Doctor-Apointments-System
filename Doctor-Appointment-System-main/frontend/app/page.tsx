"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Users, 
  Shield, 
  Heart,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Activity
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const services = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book appointments online in just a few clicks. Available 24/7 for your convenience.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Choose from available time slots that fit your schedule perfectly.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Users,
      title: "Expert Doctors",
      description: "Access to qualified and experienced healthcare professionals.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical information is protected with industry-standard security.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
  ]

  const features = [
    "Online appointment booking",
    "Real-time availability",
    "Appointment reminders",
    "Medical history tracking",
    "Multi-role access (Patient, Doctor, Admin)",
    "Secure patient data management",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/50">
      <Navbar />

      {/* Hero Section */}
      <section 
        id="home" 
        ref={heroRef}
        className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="scroll-animate">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span>Trusted Healthcare Platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                Your Health, Our
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Priority
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Book appointments with trusted doctors, manage your healthcare, and take control of your medical journey—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push("/signup")}
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-6 text-lg transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    const element = document.querySelector("#services")
                    element?.scrollIntoView({ behavior: "smooth" })
                  }}
                  size="lg"
                  variant="ghost"
                  className="px-8 py-6 text-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block scroll-animate">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl transform rotate-6 animate-pulse-glow"></div>
                <div className="relative bg-white rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl blur-2xl opacity-50"></div>
                    <Stethoscope className="relative h-40 w-40 text-blue-600 mx-auto animate-float" />
                  </div>
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">24/7 Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MediCare</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are committed to revolutionizing healthcare management through innovative technology and exceptional patient care.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="scroll-animate">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Modern Healthcare Management
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our platform provides a seamless experience for patients, doctors, and administrators. 
                We understand the importance of accessible healthcare and have built a system that 
                makes managing appointments simple and efficient.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With our comprehensive appointment system, you can book consultations, track your 
                medical history, and communicate with healthcare providers—all from the comfort of your home.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">100+</div>
                  <div className="text-sm font-medium text-gray-600">Active Doctors</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">1000+</div>
                  <div className="text-sm font-medium text-gray-600">Happy Patients</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 scroll-animate">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-red-50 to-pink-50">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Patient Care</h4>
                  <p className="text-sm text-gray-600">
                    Focused on providing the best patient experience
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Secure Platform</h4>
                  <p className="text-sm text-gray-600">
                    Your data is protected with advanced security
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">24/7 Access</h4>
                  <p className="text-sm text-gray-600">
                    Book appointments anytime, anywhere
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Expert Team</h4>
                  <p className="text-sm text-gray-600">
                    Qualified healthcare professionals
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need for seamless healthcare management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 scroll-animate group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 relative">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-10 shadow-xl scroll-animate">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Platform <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Features</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Contact <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="scroll-animate">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                Get in Touch
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Email</h4>
                    <p className="text-gray-600">info@medicare.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">
                      123 Healthcare Street<br />
                      Medical City, MC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="border-0 shadow-2xl scroll-animate">
              <CardContent className="p-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  Send us a Message
                </h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 py-6 text-lg font-semibold"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">MediCare</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted healthcare management platform. Connecting patients with quality healthcare providers.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {["Home", "About", "Services", "Contact"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        const element = document.querySelector(`#${item.toLowerCase()}`)
                        element?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block transform"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors duration-300 inline-block transform hover:translate-x-2">
                    Login
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 inline-block transform hover:translate-x-2">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-300 inline-block transform hover:translate-x-2">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Follow Us</h4>
              <div className="flex gap-4">
                {["Facebook", "Twitter", "LinkedIn"].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-br hover:from-blue-500 hover:to-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                  >
                    <span className="text-xs font-semibold">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 MediCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
