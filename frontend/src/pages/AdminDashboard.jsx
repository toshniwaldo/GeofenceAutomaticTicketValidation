"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MapModal from "../components/MapModal" // Import the MapModal component

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all-events")
  const [showProfile, setShowProfile] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [profileData, setProfileData] = useState({ name: "", email: "" })

  // Unified form data state for both create and edit
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    area: "",
    radius: 1.0,
    price: 0,
    location: { type: "Point", coordinates: [0, 0] }, // [longitude, latitude]
  })
  const [isEditing, setIsEditing] = useState(false) // To differentiate create/edit mode
  const [currentEventId, setCurrentEventId] = useState(null) // To store ID of event being edited
  const [formMessage, setFormMessage] = useState({ type: "", text: "" }) // For create/update messages
  const [showMapModal, setShowMapModal] = useState(false) // State for map modal

  // Get user data from localStorage and check role
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!userData || !token) {
      navigate("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      navigate("/user-dashboard") // Redirect if not an admin
      return
    }

    setUser(parsedUser)
    setProfileData({ name: parsedUser.name, email: parsedUser.email })

    fetchEvents(token)
  }, [navigate])

  // Fetch all events (for admin view)
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
      setLoading(false)
    } catch (error) {
      console.error("Error fetching events:", error)
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name === "radius" || name === "price") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number.parseFloat(value),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Callback from MapModal to set coordinates for the form
  const handleFormLocationSelect = (latitude, longitude) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // MapLibre uses [lng, lat]
      },
    }))
  }

  // Handle form submission (create or update)
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormMessage({ type: "", text: "" })
    const token = localStorage.getItem("token")

    // Basic validation for location
    if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
      setFormMessage({ type: "error", text: "Please select a location on the map." })
      return
    }

    try {
      let response
      if (isEditing && currentEventId) {
        // Update existing event
        response = await fetch(`http://localhost:5000/events/update/${currentEventId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Create new event
        response = await fetch("http://localhost:5000/events/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      }

      const data = await response.json()
      if (response.ok) {
        setFormMessage({
          type: "success",
          text: isEditing ? "Event updated successfully!" : "Event created successfully!",
        })
        // Reset form and mode
        setFormData({
          name: "",
          date: "",
          time: "",
          area: "",
          radius: 1.0,
          price: 0,
          location: { type: "Point", coordinates: [0, 0] },
        })
        setIsEditing(false)
        setCurrentEventId(null)
        fetchEvents(token) // Refresh events list
      } else {
        setFormMessage({ type: "error", text: data.error || "Operation failed." })
      }
    } catch (error) {
      console.error("Error submitting event:", error)
      setFormMessage({ type: "error", text: "Network error. Please try again." })
    }
  }

  // Handle Edit button click
  const handleEditClick = (event) => {
    // Set form data to the event being edited
    setFormData({
      name: event.name,
      date: event.date.split("T")[0], // Format date for input type="date"
      time: event.time,
      area: event.area,
      radius: event.radius,
      price: event.price,
      location: {
        type: "Point",
        coordinates: event.location.coordinates,
      },
    })
    setIsEditing(true)
    setCurrentEventId(event._id)
    setActiveTab("create-event") // Switch to the form tab
    setFormMessage({ type: "", text: "" }) // Clear any previous messages
  }

  // Handle Delete Event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return
    }

    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:5000/events/delete/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        alert("Event deleted successfully!")
        fetchEvents(token) // Refresh events list
      } else {
        alert(data.error || "Failed to delete event.")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Network error. Please try again.")
    }
  }

  // Reset form when switching to create tab
  const handleCreateTabClick = () => {
    setActiveTab("create-event")
    setIsEditing(false)
    setCurrentEventId(null)
    setFormData({
      name: "",
      date: "",
      time: "",
      area: "",
      radius: 1.0,
      price: 0,
      location: { type: "Point", coordinates: [0, 0] },
    })
    setFormMessage({ type: "", text: "" })
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
          <p className="text-white mt-4">Loading admin dashboard...</p>
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
                  Admin Dashboard, {user?.name}
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
              onClick={() => setActiveTab("all-events")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "all-events"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-purple-200 hover:bg-white/10"
              }`}
            >
              🗓️ All Events
            </button>
            <button
              onClick={handleCreateTabClick} // Use the new handler
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "create-event"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-purple-200 hover:bg-white/10"
              }`}
            >
              {isEditing ? "✏️ Edit Event" : "✨ Create Event"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-6">
        {activeTab === "all-events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="col-span-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
                <p className="text-purple-200/80 text-lg">No events created yet.</p>
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
                      <div className="flex items-center text-purple-200/80">
                        <span className="mr-2">🗺️</span>
                        Lat: {event.location.coordinates[1]}, Lng: {event.location.coordinates[0]}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="flex-1 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="flex-1 py-2 bg-red-500/20 border border-red-400/30 text-red-200 rounded-lg hover:bg-red-500/30 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "create-event" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                {isEditing ? "Edit Event" : "Create New Event"}
              </h2>

              {formMessage.text && (
                <div
                  className={`mb-6 p-4 rounded-xl ${
                    formMessage.type === "success"
                      ? "bg-green-500/20 border border-green-400/30 text-green-200"
                      : "bg-red-500/20 border border-red-400/30 text-red-200"
                  } backdrop-blur-sm animate-in slide-in-from-top duration-500`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{formMessage.type === "success" ? "✅" : "❌"}</span>
                    <p className="text-sm">{formMessage.text}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                  />
                </div>
                {/* Location selection using map */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-200 mb-2">Event Location</label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowMapModal(true)}
                      className="flex-1 py-3 px-6 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                      Select Location on Map
                    </button>
                    <div className="text-purple-200/80 text-sm">
                      {formData.location.coordinates[0] !== 0 || formData.location.coordinates[1] !== 0
                        ? `Lat: ${formData.location.coordinates[1].toFixed(6)}, Lng: ${formData.location.coordinates[0].toFixed(6)}`
                        : "No location selected"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Radius (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="radius"
                      value={formData.radius}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      step="1"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCreateTabClick} // Cancel edit and switch to create mode
                      className="flex-1 py-3 px-6 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 translate-y-full transition-transform group-hover:translate-y-0"></div>
                    <div className="relative">{isEditing ? "Update Event" : "Create Event"}</div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <MapModal
          onClose={() => setShowMapModal(false)}
          onSelectLocation={handleFormLocationSelect}
          initialCoordinates={
            formData.location.coordinates[0] !== 0 || formData.location.coordinates[1] !== 0
              ? [formData.location.coordinates[0], formData.location.coordinates[1]]
              : undefined // Pass current coordinates if set, otherwise undefined for default
          }
        />
      )}
    </div>
  )
}
