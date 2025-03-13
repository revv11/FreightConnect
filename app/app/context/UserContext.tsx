"use client"
import { createContext , useState, useEffect, useContext, ReactNode} from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export interface getUser{
    id: string,
    email: string,
    name: string,
    role: string,
    truckerProfile:any,
    shipperProfile: any,
   
   
   
}

interface ContextType{
    currentUser: getUser,
    setCurrentUser: any,
}


//types need to be fixed
export const UserContext = createContext<any | null>(null)

export const useUserContext = (): any | null=>{
    const {currentUser, setSubmitData} = useContext(UserContext);
    if(currentUser === undefined){
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return {currentUser, setSubmitData};
}

export const UserContextProvider = ({children}: {children: ReactNode})=>{
    const session   = useSession()
    const user = session.data?.user;
    
    
    const [submitdata, setSubmitData] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>({id:Number(user?.id) })
    useEffect(()=>{
        if(session.data?.user){
            async function setuser(){
                console.log("called-------------------------------------")
                const existinguser = await axios.get(`/api/user/details`)
                const data = existinguser.data.user

               
            
                setCurrentUser({id:data?.id, name: data?.name, role: data?.role, truckerProfile: data?.truckerProfile, shipperProfile: data?.shipperProfile})
              
            }
            setuser();
            
        }
    },[session.data?.user, setSubmitData, submitdata])

    return(
        <UserContext.Provider value= {{currentUser,setSubmitData}}>
            {children}
        </UserContext.Provider>
    )
}