"use client"

import React, { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface RouteMapProps {
  fromLocation: string
  toLocation: string
  width?: string
  height?: string
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

const RouteMap: React.FC<RouteMapProps> = ({
  fromLocation,
  toLocation,
  width = "100%",
  height = "450px",
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    window.initMap = () => {
      setMapLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !fromLocation || !toLocation) return

    const renderMap = async () => {
      try {
        // Create the map instance
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 7,
          center: { lat: 20, lng: 78 }, // Default center (India)
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        })

        // Create the directions service and renderer
        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          polylineOptions: {
            strokeColor: "#4285F4",
            strokeWeight: 5,
          },
        })

        // Request directions
        const request = {
          origin: fromLocation,
          destination: toLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        }

        directionsService.route(request, (result: any, status: any) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result)
            
            // Fit map to route bounds
            const bounds = new window.google.maps.LatLngBounds()
            const route = result.routes[0]
            
            route.legs.forEach((leg: any) => {
              leg.steps.forEach((step: any) => {
                step.path.forEach((path: any) => {
                  bounds.extend(path)
                })
              })
            })
            
            map.fitBounds(bounds)
          } else {
            setMapError(`Directions request failed: ${status}`)
          }
        })
      } catch (error) {
        setMapError("Error rendering map")
        console.error("Map rendering error:", error)
      }
    }

    renderMap()
  }, [mapLoaded, fromLocation, toLocation])

  return (
    <>
      <Script
        src={`https://maps.gomaps.pro/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPSAPI}&libraries=places&callback=initMap`}
        strategy="afterInteractive"
      />
      
      <div 
        ref={mapRef} 
        style={{ width, height, borderRadius: "0.5rem" }}
        className={`bg-gray-100 ${className}`}
      >
        {!mapLoaded && (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Loading map...</p>
            </div>
          </div>
        )}
        
        {mapError && (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-red-500 mb-2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-red-500">{mapError}</p>
              <p className="mt-1 text-xs text-gray-500">Please check the provided locations and try again</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default RouteMap