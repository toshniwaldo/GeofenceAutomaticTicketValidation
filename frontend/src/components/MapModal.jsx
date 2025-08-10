"use client"

import { useRef, useEffect, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css" // Import MapLibre GL CSS

export default function MapModal({ onClose, onSelectLocation, initialCoordinates }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  // MapLibre uses [lng, lat] for coordinates
  const [selectedCoords, setSelectedCoords] = useState(initialCoordinates || [0, 0]) // [lng, lat]
  const [searchQuery, setSearchQuery] = useState("")
  const [isLocating, setIsLocating] = useState(false) // New state for current location loading
  const [locationAccuracy, setLocationAccuracy] = useState(null) // New state for location accuracy
  const GEOAPIFY_API_KEY = "ef818c91aeca43b58ab2fb65d7607bd1" // Your Geoapify API Key

  useEffect(() => {
    if (mapRef.current) return // Initialize map only once

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${GEOAPIFY_API_KEY}`,
      center: selectedCoords[0] !== 0 || selectedCoords[1] !== 0 ? selectedCoords : [77.209, 28.6139], // Default to Delhi if no initial coords
      zoom: selectedCoords[0] !== 0 || selectedCoords[1] !== 0 ? 12 : 5, // Zoom in if specific coords, else wider view
    })

    mapRef.current.on("load", () => {
      // Add a marker
      markerRef.current = new maplibregl.Marker({
        draggable: true,
        color: "#FF0000", // Red marker
      })
        .setLngLat(selectedCoords)
        .addTo(mapRef.current)

      // Update coordinates on marker drag
      markerRef.current.on("dragend", () => {
        const lngLat = markerRef.current.getLngLat()
        setSelectedCoords([lngLat.lng, lngLat.lat])
        setLocationAccuracy(null) // Clear accuracy when manually dragging
      })

      // Update coordinates on map click
      mapRef.current.on("click", (e) => {
        const newLngLat = [e.lngLat.lng, e.lngLat.lat]
        setSelectedCoords(newLngLat)
        markerRef.current.setLngLat(newLngLat) // Move marker to click location
        setLocationAccuracy(null) // Clear accuracy when manually clicking
      })
    })

    // Clean up map on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // Empty dependency array means this runs once on mount

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&apiKey=${GEOAPIFY_API_KEY}`,
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const { lon, lat } = data.features[0].properties
        const newLngLat = [lon, lat]
        setSelectedCoords(newLngLat)
        mapRef.current.flyTo({ center: newLngLat, zoom: 14 }) // Fly to the new location
        markerRef.current.setLngLat(newLngLat) // Move marker to the new location
        setLocationAccuracy(null) // Clear accuracy after search
      } else {
        alert("Location not found. Please try a different search query.")
      }
    } catch (error) {
      console.error("Error searching for location:", error)
      alert("Failed to search for location. Please try again.")
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true) // Start loading
      setLocationAccuracy(null) // Clear previous accuracy

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          const newLngLat = [longitude, latitude] // Geolocation API returns [lat, lng], MapLibre uses [lng, lat]
          setSelectedCoords(newLngLat)
          mapRef.current.flyTo({ center: newLngLat, zoom: 16 }) // Zoom in more for current location
          markerRef.current.setLngLat(newLngLat)
          setLocationAccuracy(accuracy) // Set accuracy
          setIsLocating(false) // End loading
        },
        (error) => {
          console.error("Error getting current location:", error)
          alert("Unable to retrieve your current location. Please ensure location services are enabled and try again.")
          setIsLocating(false) // End loading on error
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }, // Increased timeout to 10 seconds
      )
    } else {
      alert("Geolocation is not supported by your browser.")
    }
  }

  const handleSave = () => {
    onSelectLocation(selectedCoords[1], selectedCoords[0]) // Pass lat, lng to parent
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 max-w-3xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            Select Event Location
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            ✕
          </button>
        </div>

        {/* Search Section */}
        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            Search
          </button>
        </div>

        {/* Use Current Location Button */}
        <button
          onClick={handleUseCurrentLocation}
          disabled={isLocating} // Disable button while locating
          className="w-full py-3 px-6 mb-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLocating ? "Locating..." : "Use Current Location"}
        </button>

        <div
          ref={mapContainerRef}
          className="flex-1 rounded-xl overflow-hidden mb-4"
          style={{ height: "100%", width: "100%" }}
        ></div>
        <div className="text-purple-200/80 text-sm mb-4">
          Selected: Lat: {selectedCoords[1].toFixed(6)}, Lng: {selectedCoords[0].toFixed(6)}
          {locationAccuracy !== null && <span className="ml-2"> (Accuracy: ±{locationAccuracy.toFixed(2)}m)</span>}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  )
}
