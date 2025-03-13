"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Calculator, Home, Info, MapPin, Package, Route, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Appbar from "@/components/custom/Appbar"
import Script from "next/script"
import axios from "axios"
import { useSession } from "next-auth/react"

// Define Google Maps related types
declare global {
  interface Window {
    google: any;
    initAutoComplete: () => void;
  }
}

export default function PostJobPage() {
    const session = useSession()
  const [jobData, setJobData] = useState({
    price: "",
    weight: "",
    fromLocation: "",
    toLocation: "",
    distance: "",
  })
  const submit = async (e:any)=>{
    e.preventDefault();
    try{
        await axios.post('/api/job', {shipperId: session.data?.user.id,price: Number(jobData.price), weight: Number(jobData.weight), distance: Number(jobData.distance), to: jobData.toLocation, from: jobData.fromLocation})
        alert("success")
    }
    catch(e){
        alert(e)
        console.log(e)
    }
  }
  const [summary, setSummary] = useState({
    price: "Rs 0.00",
    weight: "0 kg",
    distance: "0 km",
    totalAmount: "Rs 0.00",
  })

  const [mapLoaded, setMapLoaded] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState("")
  
  // Refs for Google Places Autocomplete
  const fromInputRef = useRef<HTMLInputElement>(null)
  const toInputRef = useRef<HTMLInputElement>(null)
  const fromAutocomplete = useRef<any>(null)
  const toAutocomplete = useRef<any>(null)

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (mapLoaded && fromInputRef.current && toInputRef.current) {
      // Setup autocomplete for "from" location
      fromAutocomplete.current = new window.google.maps.places.Autocomplete(fromInputRef.current, {
        types: ['address'],
      })
      fromAutocomplete.current.addListener('place_changed', () => {
        const place = fromAutocomplete.current.getPlace()
        setJobData(prev => ({ ...prev, fromLocation: place.formatted_address }))
      })

      // Setup autocomplete for "to" location
      toAutocomplete.current = new window.google.maps.places.Autocomplete(toInputRef.current, {
        types: ['address'],
      })
      toAutocomplete.current.addListener('place_changed', () => {
        const place = toAutocomplete.current.getPlace()
        setJobData(prev => ({ ...prev, toLocation: place.formatted_address }))
      })
    }
  }, [mapLoaded])

  // Setup global initialization function for Google Maps
  useEffect(() => {
    window.initAutoComplete = () => {
      setMapLoaded(true)
    }
  }, [])

  useEffect(() => {
    // Update summary when job data changes
    const price = jobData.price ? Number.parseFloat(jobData.price) : 0
    const weight = jobData.weight ? Number.parseFloat(jobData.weight) : 0
    const distance = jobData.distance ? Number.parseFloat(jobData.distance) : 0

    setSummary({
      price: `Rs. ${price.toFixed(2)}`,
      weight: `${weight} kg`,
      distance: `${distance} km`,
      totalAmount: `Rs. ${price.toFixed(2)}`,
    })
  }, [jobData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setJobData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateDistance = () => {
    if (!jobData.fromLocation || !jobData.toLocation) {
      setError("Please enter both pickup and delivery locations")
      return
    }

    setCalculating(true)
    setError("")

    // Use Distance Matrix API to calculate the distance
    const distanceService = new window.google.maps.DistanceMatrixService()
    
    distanceService.getDistanceMatrix(
      {
        origins: [jobData.fromLocation],
        destinations: [jobData.toLocation],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response: any, status: string) => {
        setCalculating(false)
        
        if (status === 'OK') {
          const distance = response.rows[0].elements[0]
          
          if (distance.status === 'OK') {
            // Extract distance value in kilometers (remove ' km' from string)
            const distanceValue = distance.distance.text.replace(' km', '')
            setJobData(prev => ({ ...prev, distance: distanceValue }))
          } else {
            setError("Unable to calculate distance between these locations")
          }
        } else {
          setError("Error calculating distance. Please try again.")
        }
      }
    )
  }

  return (
    <>
      {/* Load Google Maps API */}
      <Script
        src={`https://maps.gomaps.pro/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPSAPI}&libraries=places&callback=initAutoComplete`}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <Appbar/>

        {/* Main Content */}
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Job Form */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold mb-1">Post New Job</h1>
                  <p className="text-gray-500 mb-6">Fill in the job details below</p>

                  {error && (
                    <Alert className="bg-red-50 text-red-800 border-red-100 mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-6">
                    {/* Price Input */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium mb-2">
                        Price (INR)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">Rs.</span>
                        </div>
                        <Input
                          id="price"
                          name="price"
                          type="text"
                          placeholder="Enter amount"
                          className="pl-8"
                          value={jobData.price}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Weight Input */}
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium mb-2">
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <Input
                          id="weight"
                          name="weight"
                          type="text"
                          placeholder="Enter weight"
                          value={jobData.weight}
                          onChange={handleInputChange}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Location Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fromLocation" className="block text-sm font-medium mb-2">
                          From Location
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            id="fromLocation"
                            name="fromLocation"
                            type="text"
                            placeholder="Enter pickup location"
                            className="pl-10"
                            value={jobData.fromLocation}
                            onChange={handleInputChange}
                            ref={fromInputRef}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="toLocation" className="block text-sm font-medium mb-2">
                          To Location
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            id="toLocation"
                            name="toLocation"
                            type="text"
                            placeholder="Enter delivery location"
                            className="pl-10"
                            value={jobData.toLocation}
                            onChange={handleInputChange}
                            ref={toInputRef}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Calculate Distance Button */}
                    <Button 
                      variant="outline" 
                      className="text-blue-600" 
                      onClick={calculateDistance}
                      disabled={!mapLoaded || calculating || !jobData.fromLocation || !jobData.toLocation}
                    >
                      {calculating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Calculating...
                        </span>
                      ) : (
                        <>
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculate Distance
                        </>
                      )}
                    </Button>

                    {/* Distance Input */}
                    <div>
                      <label htmlFor="distance" className="block text-sm font-medium mb-2">
                        Distance (km)
                      </label>
                      <div className="relative">
                        <Input
                          id="distance"
                          name="distance"
                          type="text"
                          placeholder="Enter distance"
                          value={jobData.distance}
                          onChange={handleInputChange}
                          readOnly={true}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">km</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 text-blue-800 border-blue-100">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Begin typing to see location suggestions. Distance will be calculated using Google Maps.
                      </AlertDescription>
                    </Alert>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        onClick={submit}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!jobData.price || !jobData.weight || !jobData.fromLocation || !jobData.toLocation || !jobData.distance}
                      >
                        Post Job
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Summary */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Job Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">{summary.price}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{summary.weight}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{summary.distance}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Amount</span>
                        <span className="text-xl font-bold">{summary.totalAmount}</span>
                      </div>
                    </div>

                    {(jobData.fromLocation || jobData.toLocation) && (
                      <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <div className="flex items-start space-x-2">
                          <Route className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="space-y-1">
                            <h3 className="font-medium">Route</h3>
                            <p className="text-sm text-gray-600">From: {jobData.fromLocation || "Not specified"}</p>
                            <p className="text-sm text-gray-600">To: {jobData.toLocation || "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-gray-500 text-sm">
          © 2024 ShipEase. All rights reserved.
        </footer>
      </div>
    </>
  )
}