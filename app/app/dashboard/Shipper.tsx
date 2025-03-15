"use client"
import Link from "next/link"
import Appbar from "@/components/custom/Appbar"
import {
 
  Eye,
  Package,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ShipperCard from "@/components/custom/ShipperCard"
import { useGetShipperJobs } from "../hooks/useGetShipperJobs"
import { useUserContext } from "../context/UserContext"

export default function Shipper() {


  const {currentUser} = useUserContext()
  const {jobs, loading} = useGetShipperJobs()


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
        <Appbar/>
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {currentUser.shipperProfile.companyName}</h1>

        {/* Stats Cards */}
        

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href='/dashboard/job'>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Package className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </Link>
            <Button variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              Track Shipments
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Active Jobs */}
          <div className="lg:w-3/4">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Jobs {`(${jobs?.length})`}</h2>
              
            </div>
            <div>
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
                  <div>
                    {jobs.map((job) => (
                      <div key={job.id}>
                        <ShipperCard job={job}/>
                      </div>
                    ))}
                  </div>
                  }
                </div>

              }
            </div>
          </div>

          
          
        </div>
      </main>
    </div>
  )
}

