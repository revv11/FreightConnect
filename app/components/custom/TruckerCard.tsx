
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  Truck,
} from "lucide-react"


export default function TruckerCard({job}: {job:any}){
    const router = useRouter()
    return(
        <div>
            <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <img src={job.logo || "/placeholder.svg"} alt={job.shipper.companyName} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{job.shipper.companyName}</h3>
                          <p className="text-sm text-gray-500">{`(${(job.shipper.companyType).toUpperCase()})`}</p>
                          {job.verified && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                        </div>
                       
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium">From: {job.from}</p>
                          <p className="font-medium">To: {job.to}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {/* <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{job.duration}</span>
                        </div> */}
                        <div className="flex items-center space-x-1">
                          <Truck className="h-4 w-4 text-gray-400" />
                          <span>{job.distance} km</span>
                        </div>
                      </div>
                      <div>
                        
                        <p className="text-sm text-gray-500">{job.weight} kgs</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                     
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="text-xl font-bold text-blue-600">Rs. {job.price}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={()=>{router.push(`/dashboard/job/${job.id}`)}} className="flex-1 bg-blue-600 hover:bg-blue-700">Bid</Button>
                        
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
        </div>
    )
}