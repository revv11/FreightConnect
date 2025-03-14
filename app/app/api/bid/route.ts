import { db } from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const {truckerId, jobId, amount} = body;
        let newbid;
        const bid = await db.bid.findFirst({
            where:{
                jobId,
                truckerId,
            }
            
        })
        if(bid){
            newbid = await db.bid.update({
                where:{
                    id: bid.id,
                },
                data:{
                    amount:parseFloat(amount)
                },
                select:{
                    amount:true,
                    truckerId:true,
                    id:true,
                    trucker:{
                        select:{
                            user:{
                                select:{
                                    name:true
                                    
                                }
                            }
                        }
                    }
                }
            })
        }
        else{
            newbid = await db.bid.create({
                data:{
                    amount: parseFloat(amount),
                    truckerId,
                    jobId
                },
                select:{
                    amount:true,
                    truckerId:true,
                    id:true,
                    trucker:{
                        select:{
                            user:{
                                select:{
                                    name:true
                                    
                                }
                            }
                        }
                    }
                }
            })
        }
        newbid = {
            amount: newbid.amount,
            truckerId: newbid.truckerId,
            id: newbid.id,
            trucker: newbid.trucker.user.name

        }

        await axios.post(`${process.env.WEBSOCKET_URL}/broadcast`, {jobId, newbid})
        return NextResponse.json({newbid}, {status:201})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({error:e}, {status:500})
    }
}