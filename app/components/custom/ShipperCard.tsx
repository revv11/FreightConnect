import Link from "next/link"
import Appbar from "@/components/custom/Appbar"
import { useState } from "react"
import {
  Edit,
  Eye,
  MapPin,
 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"





export default function ShipperCard({job}: {job:any}){
    return(
        <Card key={job.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{job.id}</span>
                        <Badge
                          variant={job.status === "Active" ? "default" : "outline"}
                          className={
                            job.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">From: {job.from}</p>
                              <p className="text-sm font-medium">To: {job.to}</p>
                              <p className="text-xs text-gray-500">{job.distance} km</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="text-sm">{job.weight} kgs</p>
                          </div>
                          
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="text-xl font-bold text-blue-600">Rs. {job.price}</p>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Job
                          </Button>
                          <Link href={`/dashboard/job/${job.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* Progress bar for active jobs */}
                    {job.status === "Active" && (
                      <div className="h-1.5 bg-blue-100">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: job.id === "JOB-2024-001" ? "30%" : "70%" }}
                        ></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
    )
}