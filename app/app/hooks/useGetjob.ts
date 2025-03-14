import axios from "axios";
import { useState, useEffect } from "react";
export const useGetJob  = ({jobId}: {jobId:string}) =>{

    
  

    const [loading, setLoading] = useState(true)
    const [job , setJob] = useState<any>();

    useEffect(()=>{
        
        axios.get(`/api/job?jobId=${jobId}`
            
        )
            .then(response => {
                console.log(response.data.jobs)
                setJob(response.data.jobs);
                setLoading(false)
        })

        
    },[])

    return(
        {
            loading,job
        }
    )
    
}