"use client"
import Link from "next/link"
import Appbar from "@/components/custom/Appbar"
import { useState } from "react"
import {
  Bell,
  ChevronDown,
  DollarSign,
  Edit,
  Eye,
  Filter,
  MapPin,
  Package,
  Search,
  Truck,
  TruckIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"


export default function Shipper() {
  const [activeJobs, setActiveJobs] = useState([
    {
      id: "JOB-2024-001",
      status: "Active",
      from: "Los Angeles, CA",
      to: "Seattle, WA",
      miles: 1135,
      weight: "15,000 lbs",
      dimensions: "48' x 8.5' x 8.5'",
      price: "$3,450",
      pickup: "Feb 15, 2024",
      delivery: "Feb 18, 2024",
    },
    {
      id: "JOB-2024-002",
      status: "Pending",
      from: "Miami, FL",
      to: "Atlanta, GA",
      miles: 662,
      weight: "8,500 lbs",
      dimensions: "24' x 8.5' x 8.5'",
      price: "$1,850",
      pickup: "Feb 16, 2024",
      delivery: "Feb 17, 2024",
    },
    {
      id: "JOB-2024-003",
      status: "Active",
      from: "Chicago, IL",
      to: "New York, NY",
      miles: 787,
      weight: "22,000 lbs",
      dimensions: "53' x 8.5' x 8.5'",
      price: "$2,950",
      pickup: "Feb 14, 2024",
      delivery: "Feb 16, 2024",
    },
  ])

  const recentActivities = [
    {
      type: "bid",
      message: "New trucker bid received for JOB-2024-001",
      time: "10 minutes ago",
    },
    {
      type: "checkpoint",
      message: "Shipment JOB-2024-003 reached checkpoint",
      time: "1 hour ago",
    },
    {
      type: "job",
      message: "New job posted: Miami to Atlanta",
      time: "2 hours ago",
    },
    {
      type: "payment",
      message: "Payment processed for JOB-2024-002",
      time: "3 hours ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
        <Appbar/>
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Welcome back, FastFreight Inc.</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Shipments</p>
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-xs text-green-600">+2 this week</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Deliveries</p>
                <h3 className="text-2xl font-bold">156</h3>
                <p className="text-xs text-green-600">+23 this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spend</p>
                <h3 className="text-2xl font-bold">$45,678</h3>
                <p className="text-xs text-green-600">+12% vs last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Truckers</p>
                <h3 className="text-2xl font-bold">48</h3>
                <p className="text-xs text-gray-500">In your area</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <h2 className="text-lg font-semibold">Your Active Jobs (3)</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input type="text" placeholder="Search jobs..." className="pl-8 w-full sm:w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Date
                </Button>
                <Button variant="outline" size="sm">
                  Sort
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {activeJobs.map((job) => (
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
                              <p className="text-xs text-gray-500">{job.miles} miles</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="text-sm">{job.weight}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Dimensions</p>
                            <p className="text-sm">{job.dimensions}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="text-xl font-bold text-blue-600">{job.price}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Pickup: {job.pickup}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Delivery: {job.delivery}</p>
                          </div>
                        </div>
                        <div className="flex justify-between pt-2">
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Job
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
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
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      <div>
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

