"use client"
import Shipper from "./Shipper"
import { useSession } from "next-auth/react"
import { useUserContext } from "../context/UserContext"
import Trucker from "./Trucker"
export default function Page(){
    const {currentUser} = useUserContext()
    

    if(currentUser.role === "SHIPPER"){
        return(
            <Shipper/>
        )

    }
    else if(currentUser.role === "TRUCKER"){
        return(
            <Trucker/>
        )
    }
}