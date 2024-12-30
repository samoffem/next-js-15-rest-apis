import connect from "@/lib/db"
import User from "@/lib/models/users"
import Category from "@/lib/models/category"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const GET = async (request: Request)=>{
    try {
        console.log(request)
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}),
                {
                    status: 400
                }
            )
        }
        await connect()

        const user = await User.findById(userId)

        if(!user){
            return new NextResponse(JSON.stringify({message: "user not found in the database"}),
        {
            status: 400
        })
        }

        const categories = await Category.find({
            user: new Types.ObjectId(userId)
        })

        return new  NextResponse(JSON.stringify(categories),{
            status: 200
        })

    } catch (error) {
        
    }
}