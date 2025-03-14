import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useUserContext } from "../context/UserContext";



export const useGetShipperJobs  = () =>{

    const session = useSession()
    const {currentUser} = useUserContext()
    let Id:any;
    if(currentUser.role==="SHIPPER"){
      
        Id = session.data?.user?.id 

    }
    else{
        Id = "trucker"
    }

    const [loading, setLoading] = useState(true)
    const [jobs , setJobs] = useState<any[]>();

    useEffect(()=>{
        axios.get(`/api/jobs?shipperId=${Id}`
            
        )
            .then(response => {
                console.log(response.data.jobs)
                setJobs(response.data.jobs);
                setLoading(false)
            })
    },[])

    return(
        {
            loading,jobs
        }
    )
    
}