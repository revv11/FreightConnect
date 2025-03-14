"use client"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useUserContext } from "@/app/context/UserContext"
import { signOut } from "next-auth/react"
import {
    Bell,
    ChevronDown,
    TruckIcon,
  } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
export default function Appbar(){
    const session  = useSession()

    const {currentUser}= useUserContext()
   
    return(
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <Link href='/dashboard'>
            <div className="flex items-center space-x-2">
              <TruckIcon className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl text-blue-600">FreightConnect</span>
            </div>
          </Link>
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.data?.user?.image} alt="" />
                  
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{currentUser.name}</span>
                  <span className="text-xs text-gray-500">{currentUser.role}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{signOut()}}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    )
}