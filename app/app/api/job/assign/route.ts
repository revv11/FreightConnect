import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";



export async function POST(req:NextRequest){
    try {
        const body = await req.json();
        const { shipperId, jobId } = body;
    
        return await db.$transaction(async (tx) => {
          // 1️ Check if the job exists for the given shipperId
          const job = await tx.job.findUnique({
            where: { id: jobId, shipperId },
          });
    
          if (!job) {
            return NextResponse.json({ error: "Job not found or unauthorized" }, { status: 404 });
          }
    
          // 2️ Get the lowest bid amount for the given jobId
          const lowestBid = await tx.bid.findFirst({
            where: { jobId },
            orderBy: { amount: "asc" }, // Lowest bid first
            select: { amount: true, truckerId:true },
          });
    
          if (!lowestBid) {
            return NextResponse.json({ error: "No bids found for this job" }, { status: 404 });
          }
    
          // 3️⃣Delete all bids for this job
          await tx.bid.deleteMany({ where: { jobId } });
    
          // 4️ Update the Job table
          const updatedJob = await tx.job.update({
            where: { id: jobId },
            data: {
              status: "ACTIVE",
              truckerId: lowestBid.truckerId,
              finalAmount: lowestBid.amount, // Adding finalAmount field
            },
          });
    
          return NextResponse.json({ message: "Job updated successfully", job: updatedJob }, { status: 200 });
        });
      } catch (e) {
        console.error("Error processing job:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
}