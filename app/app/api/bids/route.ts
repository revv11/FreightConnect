
import { db } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
       
      
        
        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");
       
        

        const  bids = await db.bid.findMany({
            where:{
                jobId: jobId ?? '',
            },
            select:{
                    
                    
                        
                id:true,
                amount:true,
                trucker:{
                select:{
                    user:{
                        select:{
                            name:true,
                            id:true
                        }
                    }
                }
                }
                       
                    
            },
            orderBy:{
                amount: "asc"
            }
            })
            
           
            const transformedBids = bids?.map(bid => ({
            id: bid.id,
            amount: bid.amount,
            trucker: bid.trucker.user.name,
            truckerId: bid.trucker.user.id
        })) || [];
        return NextResponse.json({bids: transformedBids}, {status:200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({error:e}, {status:500})
    }
}