import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import io from "socket.io-client";
import axios from "axios"
import toast from "react-hot-toast"
import { useUserContext } from "@/app/context/UserContext"
import { useRouter } from "next/navigation"

interface Bid{
    id : string,
    trucker: string,
    amount: string,
}


const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_SERVER || "http://localhost:5000");

export default function BidList({jobId}:{jobId:string}){
    const router = useRouter();
    const [bidAmount, setBidAmount] = useState("")
    const [bids, setBids] = useState<any[]>([]);
    const {currentUser} = useUserContext()
    useEffect(() => {
    // Fetch existing bids
    const fetchBids = async () => {
        const  res  = await axios.get(`/api/bids?jobId=${jobId}`);
        console.log(res.data.bids)
        setBids(res.data.bids)
    };

    fetchBids();

    // WebSocket Event Listener
    socket.emit("joinBidRoom", jobId);
    socket.on("bidUpdate", (newbid) => {
        setBids((prevBids) => {
            // Remove previous bid by the same trucker
            const filteredBids = prevBids.filter((bid) => bid.truckerId !== newbid.truckerId);
          
            // Add the new bid and sort by amount (ascending order)
            const updatedBids = [newbid, ...filteredBids].sort((a, b) => a.amount - b.amount);
          
            return updatedBids;
          });
    });

    return () => {
      socket.off("bidUpdate");
    };
  }, [jobId]);





    
      
    
      const handleSubmitBid = async (e:any) => {
        e.preventDefault()
        try{
            await axios.post('/api/bid', {
                truckerId: currentUser.id,
                jobId,
                amount: bidAmount            
            })
            toast.success("Bid added")
            setBidAmount("")
        }
        catch(e:any){
            toast.error(e.response.data.error)
        }
        
      }

      const handleAssign = async ()=> {
        try{
            await axios.post('/api/job/assign', {jobId, truckerId :bids[0]?.truckerId })
            toast.success("Job Assigned")
            router.push('/dashboard')
        }
        catch(e:any){
            toast.error(e.response.data.error)
        }
      }


    return(
        <div>
            {/* Bidding Section */}
          <div className="space-y-6">
            {/* Place Bid */}
            {currentUser.role === "TRUCKER"?
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>
                <div className="space-y-4">
                  <div>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">{`Rs.`}</span>
                      <Input
                        type="number"
                        placeholder="Enter your bid amount"
                        className="pl-7"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  {bidAmount? 
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmitBid}>
                    Submit Bid
                  </Button>
                    : 
                    <Button disabled className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmitBid}>
                    Submit Bid
                    </Button> 
                }
                </div>
              </CardContent>
            </Card>
            :
            <div>
                
            </div>
            }

            {/* Top Bidders */}
            <Card>
            {currentUser.role === "SHIPPER" && bids.length>0? 
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAssign}>
                    {`Assign to ${bids[0].trucker}`}
                  </Button>
                    : 
                    <div>
                        
                    </div>
                }
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Top Bidders</h2>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-2">Rank</th>
                      <th className="pb-2">Trucker</th>
                      <th className="pb-2">Bid</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bidder, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="py-2">
                           
                          
                            {index+1}
                          
                        </td>
                        <td className="py-2">{bidder.trucker}</td>
                        <td className="py-2">Rs {bidder.amount}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            

          </div>
        </div>
    )
}