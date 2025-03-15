"use client"


import { Card, CardContent } from "@/components/ui/card"

import {
  Package,
} from "lucide-react"

import Appbar from "@/components/custom/Appbar"
import TruckerCard from "@/components/custom/TruckerCard"
import { useGetShipperJobs } from "../hooks/useGetShipperJobs"
import { useUserContext } from "../context/UserContext"
import Link from "next/link"
export default function TruckerDashboard() {
  
  const {jobs, loading} = useGetShipperJobs()
  const {currentUser} = useUserContext()
    console.log(currentUser)
  return (
    <div className="min-h-screen  bg-gray-50">
      {/* Header */}
      <Appbar/>

      <main className="container mx-auto py-6 px-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="">
            {currentUser.truckerProfile.activejob?
                <Link href={`/dashboard/active/${currentUser.truckerProfile.activejob}`}>
                  <CardContent className="p-6 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="bg-blue-100 p-2 rounded-lg">
                          <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                      
                        <h3 className="text-2xl text-green-500 font-bold">You have an active job!</h3>
                      
                      </div>
                  </div>
                  </CardContent>
                </Link>
            :
                <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                    <p className="text-sm text-gray-500">Available Jobs</p>
                    <h3 className="text-2xl font-bold">{jobs?.length}</h3>
                    
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
                </CardContent>
            }
          </Card>

          

          

          
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          

          {/* Jobs List */}
          <div className="flex-1 space-y-4">
            {loading?
                <div>
                    loading
                </div>
                :
                <div className="space-y-4">
                    {!jobs ? 
                <div>
                    No posted jobs
                </div>
                    :
                <div className="flex flex-col space-y-10">
                    {jobs.map((job) => (
                        <div key={job.id}>
                            <TruckerCard job={job}/>
                        </div>
                    ))}
                </div>
                }
                </div>
            
                }
          </div>
        </div>
      </main>
    </div>
  )
}