import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";


export interface DataType{
    userType?: string;
    name?: string;
    contactNumber?: string;
   
    licenseNo? : string 
    truckAge?: string
    minSalary?: Number
    maxDistance? : Number
    licenseFile? : any

    companyName? : string
    companyType?: string
    
    
}

export async function POST(req:NextRequest){
    try{
        const session = await getServerSession();
        const email = session?.user?.email;
        const body = await req.json()
        
        const res = await db.user.update({
            where:{
                email: email?? "",
            },
            data:{
                role: body.userType,
                name: body.name,
            },
            select:{
                id: true,
            }
        })
        if(body.userType === "SHIPPER"){
            await db.shipperProfile.upsert({
                where:{
                    userId: res.id
                },
                update:{
                    companyName: body.companyName,
                    companyType: body.companyType,
                },
                create:{
                    userId: res.id,
                    // user:{
                    //     connect:{
                    //         id: res.id
                    //     }
                    // },
                    companyName: body.companyName,
                    companyType: body.companyType,
                }
            })
        }
        else{
            await db.truckerProfile.upsert({
                where:{
                    userId: res.id
                },
                update:{
                   
                    licenseNo: body.licenseNo,
                    truckAge: body.truckAge,
                    minSalary: body.minSalary,
                    maxDistance: body.minSalary,
                },
                create:{
                    userId: res.id,
                    licenseNo: body.licenseNo,
                    truckAge: body.truckAge,
                    minSalary: body.minSalary,
                    maxDistance: body.minSalary,
                }
            })
        }
        
        return NextResponse.json({message: "Success"})
               
      


        
      
    }
    catch(e){
        console.log(e)
        return NextResponse.json({error: e})
    }

    
}


export async function GET(req:NextRequest){
    try{
        const session = await getServerSession();
        const email = session?.user?.email;
        const user = await db.user.findUnique({
            where:{
                email : email ?? "",
            },
            select:{
                id: true,
                email: true,
                name: true,
                role: true,
                truckerProfile: true,
                shipperProfile: true,
            }

        })
        return NextResponse.json({user})
    }
    catch(e){
        return NextResponse.json({error:e})
    }
}