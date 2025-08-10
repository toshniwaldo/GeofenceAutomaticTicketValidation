import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Simulate image rotation for background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: "Geofence Validation",
      description: "Automatic ticket validation based on your location within the event premises",
      gradient: "from-purple-400 to-pink-400",
      icon: "📍",
    },
    {
      title: "Secure Access",
      description: "Enhanced security with location-based verification and fraud prevention",
      gradient: "from-indigo-400 to-purple-400",
      icon: "🛡️",
    },
    {
      title: "Easy Booking",
      description: "Simple and quick ticket booking process for all types of events",
      gradient: "from-pink-400 to-red-400",
      icon: "🎫",
    },
  ]

  const stats = [
    { number: "50K+", label: "Events Hosted" },
    { number: "2M+", label: "Tickets Sold" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9★", label: "User Rating" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Dynamic Background Images */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-800/80"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3')] bg-cover bg-center animate-pulse"></div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1200"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 ">
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12 mb-8 transform transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl "></div>
              <div className="relative z-10">
                {/* Logo/Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-6 transform transition-transform duration-500 hover:rotate-12">
                  <span className="text-3xl">🎫</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent leading-tight">
                  EventEase
                </h1>

                <p className="text-xl md:text-2xl text-purple-200/80 mb-8 max-w-3xl mx-auto">
                  Book in seconds, enter without waiting.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 translate-y-full transition-transform group-hover:translate-y-0"></div>
                    <div className="relative flex items-center justify-center">
                      Login
                      <svg
                        className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                  >
                    Sign Up
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="text-purple-200/60 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 transform transition-all duration-500 hover:scale-105 hover:bg-white/15 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl"></div>
                <div className="relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full mb-6 transform transition-transform duration-500 group-hover:rotate-12`}
                  >
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-purple-200/80 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 transform transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                See It In Action
              </h2>
              <p className="text-purple-200/80 text-lg mb-8 max-w-2xl mx-auto">
                Watch how our geofence technology seamlessly validates tickets as attendees enter event venues
              </p>

              <div className="relative max-w-2xl mx-auto">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 cursor-pointer transform transition-transform duration-300 hover:scale-110">
                    <svg className="w-8 h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-purple-200/60">Click to watch demo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Types Showcase */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "Concerts", emoji: "🎵", color: "from-pink-500 to-rose-500" },
              { type: "Sports", emoji: "⚽", color: "from-green-500 to-emerald-500" },
              { type: "Festivals", emoji: "🎪", color: "from-yellow-500 to-orange-500" },
              { type: "Theater", emoji: "🎭", color: "from-indigo-500 to-purple-500" },
            ].map((event, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 transform transition-all duration-300 hover:scale-105 hover:bg-white/10 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${event.color} rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}
                >
                  <span className="text-xl">{event.emoji}</span>
                </div>
                <h4 className="text-white font-semibold group-hover:text-purple-200 transition-colors">{event.type}</h4>
                <p className="text-purple-200/60 text-sm mt-1">Book now</p>
              </div>
            ))}
          </div>

          {/* Floating Action Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-300"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
