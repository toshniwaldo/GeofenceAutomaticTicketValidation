import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("events")
  const [showProfile, setShowProfile] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [profileData, setProfileData] = useState({ name: "", email: "" })

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!userData || !token) {
      navigate("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setProfileData({ name: parsedUser.name, email: parsedUser.email })

    // Fetch data
    fetchEvents(token)
    fetchBookings(token, parsedUser._id)
  }, [navigate])

  // Fetch all events
  const fetchEvents = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/events/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (response.ok) {
        setEvents(data.result || [])
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  // Fetch user bookings
  const fetchBookings = async (token, userId) => {
    try {
      const response = await fetch(`http://localhost:5000/bookings/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (response.ok) {
        setBookings(data.result || [])
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setLoading(false)
    }
  }

  // Book a ticket
  const bookTicket = async (eventId) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:5000/bookings/book", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          eventId: eventId,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert("Ticket booked successfully!")
        fetchBookings(token, user._id) // Refresh bookings
      } else {
        alert(data.error || "Booking failed")
      }
    } catch (error) {
      console.error("Error booking ticket:", error)
      alert("Network error. Please try again.")
    }
  }

  // Validate ticket
  const validateTicket = async (booking, event) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const token = localStorage.getItem("token")

          try {
            const response = await fetch("http://localhost:5000/bookings/validate", {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                eventId: booking.eventId,
                latitude: latitude,
                longitude: longitude,
                bookingId: booking._id,
              }),
            })
            const data = await response.json()
            if (response.ok) {
              alert("Ticket validated successfully!")
              fetchBookings(token, user._id) // Refresh bookings
            } else {
              alert(data.error || "Validation failed")
            }
          } catch (error) {
            console.error("Error validating ticket:", error)
            alert("Network error. Please try again.")
          }
        },
        (error) => {
          alert("Location access denied. Cannot validate ticket.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/")
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/outdoor-music-festival.jpg"
          alt="Dashboard Background"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/85 to-pink-800/90"></div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{user?.name?.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Welcome, {user?.name}
                </h1>
                <p className="text-purple-200/60">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Profile
              </h2>
              <button onClick={() => setShowProfile(false)} className="text-white/60 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!editProfile}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!editProfile}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm mb-2">Role</label>
                <input
                  type="text"
                  value={user?.role}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 capitalize"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              {!editProfile ? (
                <button
                  onClick={() => setEditProfile(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditProfile(false)
                      setProfileData({ name: user.name, email: user.email })
                    }}
                    className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Here you would typically save to backend
                      setEditProfile(false)
                      alert("Profile updated successfully!")
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="relative z-10 px-6 mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "events"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-purple-200 hover:bg-white/10"
              }`}
            >
              🎪 Ongoing Events
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-purple-200 hover:bg-white/10"
              }`}
            >
              🎫 My Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-6">
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
                <p className="text-purple-200/80 text-lg">No events available at the moment</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 transform transition-all duration-300 hover:scale-105 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                        {event.name}
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full">
                        ₹{event.price}
                      </span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-purple-200/80">
                        <span className="mr-2">📅</span>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-purple-200/80">
                        <span className="mr-2">⏰</span>
                        {event.time}
                      </div>
                      <div className="flex items-center text-purple-200/80">
                        <span className="mr-2">📍</span>
                        {event.area}
                      </div>
                      <div className="flex items-center text-purple-200/80">
                        <span className="mr-2">🎯</span>
                        {event.radius}km radius
                      </div>
                    </div>

                    <button
                      onClick={() => bookTicket(event._id)}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 translate-y-full transition-transform group-hover:translate-y-0"></div>
                      <div className="relative">Book Ticket</div>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.length === 0 ? (
              <div className="col-span-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
                <p className="text-purple-200/80 text-lg">No bookings found</p>
                <button
                  onClick={() => setActiveTab("events")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              bookings.map((booking) => {
                const event = events.find((e) => e._id === booking.eventId)
                return (
                  <div
                    key={booking._id}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 transform transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                          {event?.name || "Event"}
                        </h3>
                        <span
                          className={`px-3 py-1 text-white text-sm rounded-full ${
                            booking.status === "validated"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : "bg-gradient-to-r from-yellow-500 to-orange-500"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      {event && (
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-purple-200/80">
                            <span className="mr-2">📅</span>
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center text-purple-200/80">
                            <span className="mr-2">⏰</span>
                            {event.time}
                          </div>
                          <div className="flex items-center text-purple-200/80">
                            <span className="mr-2">📍</span>
                            {event.area}
                          </div>
                          <div className="flex items-center text-purple-200/80">
                            <span className="mr-2">💰</span>₹{event.price}
                          </div>
                        </div>
                      )}

                      <div className="text-purple-200/60 text-sm mb-4">
                        Booked: {new Date(booking.bookedAt).toLocaleDateString()}
                      </div>

                      {booking.status === "booked" && (
                        <button
                          onClick={() => validateTicket(booking, event)}
                          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 translate-y-full transition-transform group-hover:translate-y-0"></div>
                          <div className="relative">Validate Ticket</div>
                        </button>
                      )}

                      {booking.status === "validated" && (
                        <div className="w-full py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-200 font-semibold rounded-xl text-center">
                          ✅ Ticket Validated
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
