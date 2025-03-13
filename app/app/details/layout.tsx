"use client"
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";


  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const {currentUser} = useUserContext()
    useEffect(()=>{
        console.log("currentuserrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", currentUser)
        if(currentUser?.id && (currentUser?.truckerProfile ||  currentUser.shipperProfile)){
          router.push('/dashboard')
        }
        else{
            setLoading(false)
        }
        
    },[currentUser])
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
  