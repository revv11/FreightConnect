"use client"
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "../context/UserContext";

  export default function RootLayout({
    children,
  }:{
    children: React.ReactNode;
  }) {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<getUser | null>(null)
    const [loading, setLoading] = useState(true)
   
    useEffect(()=>{
      async function hello(){
        
        const res = await axios.get('/api/user/details')
        setCurrentUser(res.data.user);
        const data = res.data.user
        if(data?.id && (data.truckerProfile === null &&  data.shipperProfile === null)){
          router.push('/details')
        }
        else{
          console.log("hello")
          setLoading(false)
        }
      }
      hello()
        
    },[])
    if(!currentUser?.id || loading){
      
        return(
            <div className='h-screen flex justify-center items-center'>
                Loading....
            </div>
        )
      }


    return (
    

      <div
          className={``}
      >
           
        {children}
            
      </div>
 
    );
  }
  