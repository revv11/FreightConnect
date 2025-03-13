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
        console.log(job)
        return  NextResponse.json({message:"success"}, {status: 200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({error:e}, {status:500})
    }
}

export async function GET(req: NextResponse){
    try{

    }
    catch(e){
        console.log(e)
    }
}