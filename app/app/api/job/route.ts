import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest){
    try{
        const session = await getServerSession()
      
        const body = await req.json();
     
        const {price, weight, from , to , distance, shipperId} = body;
        const job = await db.job.create({
            data:{
                shipperId,
                price,
                weight,
                from,
                to,
                distance,
            },
            select:{
                id:true
            }
        })
       
        return  NextResponse.json({message:"success"}, {status: 200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({error:e}, {status:500})
    }
}

export async function GET(req: NextRequest){
    try{
       
      
        
        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");
        
        
        
        const   jobs = await db.job.findUnique({
                where:{
                    id: jobId ?? "",
                },
                select:{
                    distance:true,
                    from: true,
                    id:true,
                    price: true,
                    shipperId:true,
                    status:true,
                    to:true,
                    weight:true,
                    shipper:{
                        select:{
                            companyName:true,
                            companyType:true,
                        }
                    }
                }
            })
         
        

        return NextResponse.json({jobs}, {status:200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({error:e}, {status:500})
    }
}