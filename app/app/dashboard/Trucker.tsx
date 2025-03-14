"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Calendar,
  DollarSign,
  Package,
  Search,
  Star,
} from "lucide-react"

import Appbar from "@/components/custom/Appbar"
import TruckerCard from "@/components/custom/TruckerCard"
import { useGetShipperJobs } from "../hooks/useGetShipperJobs"

export default function TruckerDashboard() {
  const [filters, setFilters] = useState({
    search: "",
    jobType: "all",
    distance: [1000],
    paymentMin: "500",
    paymentMax: "5000",
    loadType: "all",
    weightMin: "",
    weightMax: "",
  })
  const {jobs, loading} = useGetShipperJobs()
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Appbar/>

      <main className="container mx-auto py-6 px-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Available Jobs</p>
                  <h3 className="text-2xl font-bold">124</h3>
                  <p className="text-xs text-green-600">+12% this week</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Today's New Jobs</p>
                  <h3 className="text-2xl font-bold">45</h3>
                  <p className="text-xs text-green-600">+5 from yesterday</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Average Pay</p>
                  <h3 className="text-2xl font-bold">$1,200</h3>
                  <p className="text-xs text-green-600">+8% this month</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Your Match Rate</p>
                  <h3 className="text-2xl font-bold">85%</h3>
                  <p className="text-xs text-gray-500">Good standing</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div>
              <h3 className="font-medium mb-3">Job Type</h3>
              <RadioGroup value={filters.jobType} onValueChange={(value) => setFilters({ ...filters, jobType: value })}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id="local" />
                    <Label htmlFor="local">Local</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long-haul" id="long-haul" />
                    <Label htmlFor="long-haul">Long-haul</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express">Express</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3">Distance Range</h3>
              <Slider
                value={filters.distance}
                max={1000}
                step={50}
                onValueChange={(value) => setFilters({ ...filters, distance: value })}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 mi</span>
                <span>{filters.distance[0]} mi</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Payment Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.paymentMin}
                  onChange={(e) => setFilters({ ...filters, paymentMin: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.paymentMax}
                  onChange={(e) => setFilters({ ...filters, paymentMax: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Load Type</h3>
              <Select value={filters.loadType} onValueChange={(value) => setFilters({ ...filters, loadType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select load type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full">Full Truckload</SelectItem>
                  <SelectItem value="ltl">LTL</SelectItem>
                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-3">Weight Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min lbs"
                  value={filters.weightMin}
                  onChange={(e) => setFilters({ ...filters, weightMin: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max lbs"
                  value={filters.weightMax}
                  onChange={(e) => setFilters({ ...filters, weightMax: e.target.value })}
                />
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
          </div>

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
                <div>
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