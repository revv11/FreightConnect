"use client"
import React, {useEffect, useState} from "react"
import { useParams } from "next/navigation"
import { useUserContext } from "@/app/context/UserContext"
import TruckerJob from "./trucker"
import { useGetJob } from "@/app/hooks/useGetjob"
import ShipperJob from "./shipper"
export default function Page({params}: {params:  Promise<{ jobId: string }>}){
        const param = React.use(params)
        const {currentUser} = useUserContext()
        console.log(param.jobId)
        const {job, loading} = useGetJob({jobId:param.jobId})
       
        if(loading){
            return(
                <div className="flex justify-center h-screen items-center">
                    Loading....
                </div>
            )
        }
        else if((!loading && !job)|| job?.status !=="PENDING"){
            return(
                <div className="flex h-screen justify-center items-center">
                    404
                </div>
            )
        }
        else if(currentUser.role === "SHIPPER"){
            return(
                <div>
                    <ShipperJob jobId={param.jobId} details={job}/>
                </div>
            )
    
        }
        else if(currentUser.role === "TRUCKER"){
            return(
                <div>
                    <TruckerJob jobId={param.jobId} details={job}/>
                </div>
            )
        }
}
