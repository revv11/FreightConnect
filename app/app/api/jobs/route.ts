
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
       
      
        
        const { searchParams } = new URL(req.url);
        const shipperId = searchParams.get("shipperId");
        let jobs;
        if(shipperId !== "trucker"){
            jobs = await db.job.findMany({
                where:{
                    shipperId: shipperId ?? "",
                }
            })

        }
        else{
            jobs = await db.job.findMany({
                where:{
                    status: "PENDING"
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
            
        }

        return NextResponse.json({jobs}, {status:200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({error:e}, {status:500})
    }
}