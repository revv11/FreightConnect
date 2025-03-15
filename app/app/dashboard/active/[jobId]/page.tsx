"use client"
import TruckerNavigationPage from "./TruckerNav";
import React, {useEffect, useState} from "react"

import { useUserContext } from "@/app/context/UserContext"

import { useGetJob } from "@/app/hooks/useGetjob"

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
        else if((!loading && !job)|| job?.status !=="ACTIVE"){
            return(
                <div className="flex h-screen justify-center items-center">
                    404
                </div>
            )
        }
        else if(currentUser.role === "SHIPPER"){
            return(
                <div>
                    
                </div>
            )
    
        }
        else if(currentUser.role === "TRUCKER"){
            return(
                <div>
                    <TruckerNavigationPage jobId={param.jobId} job={job}/>
                </div>
            )
        }
}
