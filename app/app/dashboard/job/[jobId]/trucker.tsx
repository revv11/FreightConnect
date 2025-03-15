"use client"


import Link from "next/link"
import RouteMap from "@/components/custom/RouteMap"
import {  Calendar,  MapPin,  Scale, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import BidList from "@/components/custom/BidList"
import Appbar from "@/components/custom/Appbar"

export default function TruckerJob({jobId, details}: {jobId: string, details: any}) {
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Appbar />

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-6">{details.shipper.companyName}</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-medium">{details.distance} km</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Scale className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Load Weight</p>
                      <p className="font-medium">{details.weight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-medium">{details.from}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Delivery Location</p>
                      <p className="font-medium">{details.to}</p>
                    </div>
                  </div>
                </div>

                

                {/* Map Placeholder */}
                <div className="aspect-[16/9] mb-6">
                  <RouteMap 
                    fromLocation={details.from}
                    toLocation={details.to}
                    height="100%"
                    className="w-full h-full rounded-lg shadow-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Original Pay</p>
                    <p className="text-2xl font-bold text-green-600">Rs. {details.price}</p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>

          <BidList jobId={jobId} />
          
        </div>
      </main>


      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Truck className="h-5 w-5 text-blue-600" />
            <span className="font-medium">TruckBid</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/help">Help Center</Link>
          </div>
          <div className="text-sm text-gray-500 mt-4 md:mt-0">© 2024 TruckBid. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

