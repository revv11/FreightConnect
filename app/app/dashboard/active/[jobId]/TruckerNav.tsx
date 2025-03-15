"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Flag, MapPin, Navigation as NavigationIcon, Truck, User, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Appbar from "@/components/custom/Appbar"
import Link from "next/link"
import Script from "next/script"

declare global {
  interface Window {
    google: any
    initNavigationMap: () => void
  }
}

export default function TruckerNavigationPage({ jobId, job }: { jobId: string, job: any }) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPosition, setCurrentPosition] = useState<{ lat: number, lng: number } | null>(null)
  const [navigationMode, setNavigationMode] = useState<'pickup' | 'delivery'>('pickup')
  const [navigationStarted, setNavigationStarted] = useState(false)
  const [departureConfirmed, setDepartureConfirmed] = useState(false)
  const [arrivalStep, setArrivalStep] = useState<'none' | 'pickup' | 'delivery'>('none')
  const [eta, setEta] = useState<string | null>(null)
  const [remainingDistance, setRemainingDistance] = useState<string | null>(null)
  const [directions, setDirections] = useState<Array<{ instruction: string, distance: string }>>([])
  const [watchId, setWatchId] = useState<number | null>(null)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const directionsRendererRef = useRef<any>(null)
  const originMarkerRef = useRef<any>(null)
  const destinationMarkerRef = useRef<any>(null)
  const currentLocationMarkerRef = useRef<any>(null)

  // Setup global initialization function for Google Maps
  useEffect(() => {
    window.initNavigationMap = () => {
      setMapLoaded(true)
    }
  }, [])

  // Initialize map when loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    // Initialize the map - using gomaps instead of google maps directly
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: 20.5937, lng: 78.9629 }, // Default to center of India
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    })

    // Initialize the directions renderer
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      map: mapInstanceRef.current,
      suppressMarkers: true, // We'll add custom markers
      polylineOptions: {
        strokeColor: "#4285F4",
        strokeWeight: 5,
      },
    })

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentPosition(pos)

          // Center map on user location
          mapInstanceRef.current.setCenter(pos)

          // Create marker for current position
          currentLocationMarkerRef.current = new window.google.maps.Marker({
            position: pos,
            map: mapInstanceRef.current,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
            title: "Your Location",
          })
        },
        () => {
          setError("Error: Unable to retrieve your location.")
        }
      )
    } else {
      setError("Error: Geolocation is not supported by this browser.")
    }

    return () => {
      // Clear the position watch when component unmounts
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [mapLoaded])

  // Start tracking user location when navigation begins
  useEffect(() => {
    if (!navigationStarted || !mapLoaded) return
    
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentPosition(pos)
          
          // Update marker position
          if (currentLocationMarkerRef.current) {
            currentLocationMarkerRef.current.setPosition(pos)
          }
          
          // Recalculate route
          updateRoute(pos)
        },
        () => {
          setError("Error: Failed to track your location.")
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
      
      setWatchId(id)
    }
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [navigationStarted, mapLoaded, navigationMode])

  // Calculate route when navigation mode changes
  useEffect(() => {
    if (currentPosition && mapLoaded) {
      updateRoute(currentPosition)
    }
  }, [navigationMode, mapLoaded, currentPosition])

  const updateRoute = (currentPos: { lat: number, lng: number }) => {
    if (!mapLoaded || !currentPos) return
    
    const directionsService = new window.google.maps.DirectionsService()
    
    // Determine origin and destination based on navigation mode
    let origin = currentPos
    let destination = navigationMode === 'pickup' ? job.from : job.to
    
    // Clear existing markers
    if (originMarkerRef.current) originMarkerRef.current.setMap(null)
    if (destinationMarkerRef.current) destinationMarkerRef.current.setMap(null)
    
    // Request directions
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result: any, status: string) => {
        if (status === 'OK') {
          // Display the route
          directionsRendererRef.current.setDirections(result)
          
          // Set ETA and distance
          const route = result.routes[0]
          const leg = route.legs[0]
          setEta(leg.duration.text)
          setRemainingDistance(leg.distance.text)
          
          // Extract turn-by-turn directions
          const steps = leg.steps.map((step: any) => ({
            instruction: step.instructions.replace(/<[^>]*>/g, ''),
            distance: step.distance.text
          }))
          setDirections(steps)
          
          // Add destination marker
          const icon = navigationMode === 'pickup' 
            ? { url: 'https://maps.gomaps.pro/mapfiles/ms/icons/green-dot.png', scaledSize: new window.google.maps.Size(40, 40) }
            : { url: 'https://maps.gomaps.pro/mapfiles/ms/icons/red-dot.png', scaledSize: new window.google.maps.Size(40, 40) }
            
          destinationMarkerRef.current = new window.google.maps.Marker({
            position: leg.end_location,
            map: mapInstanceRef.current,
            icon: icon,
            animation: window.google.maps.Animation.DROP,
            title: navigationMode === 'pickup' ? 'Pickup Location' : 'Delivery Location'
          })
          
          // Check if very close to destination (100 meters)
          if (leg.distance.value < 100) {
            if (navigationMode === 'pickup' && arrivalStep === 'none') {
              setArrivalStep('pickup')
            } else if (navigationMode === 'delivery' && arrivalStep === 'pickup') {
              setArrivalStep('delivery')
            }
          }
        } else {
          setError(`Directions request failed due to ${status}`)
        }
      }
    )
  }

  const startNavigation = () => {
    setNavigationStarted(true)
  }

  const confirmPickupArrival = () => {
    setArrivalStep('pickup')
    setNavigationMode('delivery')
    setDirections([])
    setEta(null)
    setRemainingDistance(null)
  }

  const confirmDeliveryArrival = async () => {
    setArrivalStep('delivery')
    setNavigationStarted(false)
    
    // Update job status in the database
    try {
      const response = await fetch(`/api/jobs/${jobId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to update job status')
      }
      
      // Job status updated successfully
    } catch (error) {
      console.error('Error updating job status:', error)
      setError('Failed to update job status. Please try again.')
    }
  }

  const confirmDeparture = () => {
    setDepartureConfirmed(true)
  }

  return (
    <>
      {/* Load GoMaps API (replacing Google Maps) */}
      <Script
        src={`https://maps.gomaps.pro/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPSAPI}&libraries=places&callback=initNavigationMap`}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <Appbar />

        {/* Main Content */}
        <main className="flex-1 container mx-auto py-6 px-4">
          {/* Back Button */}
          <Link href="/trucker/jobs" passHref>
            <Button variant="ghost" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-0 relative">
                  {/* Map */}
                  <div 
                    ref={mapRef} 
                    className="w-full h-[70vh] md:h-[80vh]"
                  >
                    {!mapLoaded && (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100">
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
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      arrivalStep === 'delivery' 
                        ? 'bg-green-100 text-green-800' 
                        : navigationMode === 'pickup' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {arrivalStep === 'delivery' 
                        ? 'Completed' 
                        : navigationMode === 'pickup' 
                          ? 'En Route to Pickup' 
                          : 'En Route to Delivery'}
                    </div>
                  </div>

                  {/* Bottom Navigation Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex flex-col mb-3 md:mb-0">
                        <span className="text-sm font-medium text-gray-600">
                          {navigationMode === 'pickup' ? 'Navigating to Pickup Location' : 'Navigating to Delivery Location'}
                        </span>
                        <span className="text-lg font-bold truncate max-w-md">
                          {navigationMode === 'pickup' ? job.from : job.to}
                        </span>
                      </div>
                      
                      {navigationStarted && !arrivalStep.includes(navigationMode) && (
                        <div className="flex items-center space-x-4">
                          {remainingDistance && (
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Remaining</div>
                              <div className="font-bold">{remainingDistance}</div>
                            </div>
                          )}
                          
                          {eta && (
                            <div className="text-right">
                              <div className="text-sm text-gray-600">ETA</div>
                              <div className="font-bold">{eta}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Controls */}
            <div className="space-y-4">
              {/* Job Info Card */}
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold mb-4">Job Details</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Pickup</div>
                        <div className="text-sm font-medium">{job.from}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Flag className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Destination</div>
                        <div className="text-sm font-medium">{job.to}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Vehicle</div>
                        <div className="text-sm font-medium">{job.vehicleType}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Assigned To</div>
                        <div className="text-sm font-medium">{job.assignedTo}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Controls Card */}
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold mb-4">Navigation Controls</h2>
                  
                  <div className="space-y-4">
                    {!departureConfirmed && (
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-sm text-blue-800">
                          Please confirm your departure to start navigation.
                        </AlertDescription>
                      </Alert>
                    )}

                    {departureConfirmed && !navigationStarted && (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertDescription className="text-sm text-yellow-800">
                          Ready to start navigation to the pickup location.
                        </AlertDescription>
                      </Alert>
                    )}

                    {navigationStarted && arrivalStep === 'none' && (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-sm text-green-800">
                          Navigating to {navigationMode === 'pickup' ? 'Pickup Location' : 'Delivery Location'}.
                        </AlertDescription>
                      </Alert>
                    )}

                    {arrivalStep === 'pickup' && (
                      <Alert className="bg-purple-50 border-purple-200">
                        <AlertDescription className="text-sm text-purple-800">
                          You have arrived at the pickup location. Confirm to proceed to delivery.
                        </AlertDescription>
                      </Alert>
                    )}

                    {arrivalStep === 'delivery' && (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-sm text-green-800">
                          You have arrived at the delivery location. Job completed!
                        </AlertDescription>
                      </Alert>
                    )}

                    {!departureConfirmed && (
                      <Button 
                        className="w-full" 
                        onClick={confirmDeparture}
                      >
                        Confirm Departure
                      </Button>
                    )}

                    {departureConfirmed && !navigationStarted && (
                      <Button 
                        className="w-full" 
                        onClick={startNavigation}
                      >
                        Start Navigation
                      </Button>
                    )}

                    {navigationStarted && arrivalStep === 'none' && (
                      <div className="space-y-2">
                        <Button 
                          className="w-full" 
                          variant="outline" 
                          onClick={() => setNavigationMode('pickup')}
                          disabled={navigationMode === 'pickup'}
                        >
                          Switch to Pickup Navigation
                        </Button>
                        <Button 
                          className="w-full" 
                          variant="outline" 
                          onClick={() => setNavigationMode('delivery')}
                          disabled={navigationMode === 'delivery'}
                        >
                          Switch to Delivery Navigation
                        </Button>
                      </div>
                    )}

                    {arrivalStep === 'pickup' && (
                      <Button 
                        className="w-full" 
                        onClick={confirmPickupArrival}
                      >
                        Confirm Pickup Arrival
                      </Button>
                    )}

                    {arrivalStep === 'delivery' && (
                      <Button 
                        className="w-full" 
                        onClick={confirmDeliveryArrival}
                      >
                        Confirm Delivery Arrival
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Turn-by-Turn Directions Card */}
              {navigationStarted && directions.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-bold mb-4">Turn-by-Turn Directions</h2>
                    
                    <div className="space-y-3">
                      {directions.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">{step.instruction}</div>
                            <div className="text-xs text-gray-500">{step.distance}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}