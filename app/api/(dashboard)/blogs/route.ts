import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Blog from "@/lib/models/blog";
import  {Types} from 'mongoose'
import User from "@/lib/models/users";
import Category from "@/lib/models/category";

export const GET = async(request: Request)=>{

    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "invalid or missing userID"}),{status: 404})
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message: "invalid or missing categoryID"}),{status: 404})
        }

        await connect()

        const user = await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 404})
        }

        const category = await Category.findById(categoryId)
        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found"}), {status: 404})
        }

        const filter = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        }

        const blogs = await Blog.find(filter)

        return new NextResponse(JSON.stringify({blogs}), {
            status: 200
        })

    } catch (error: any) {
        return new NextResponse("Error in Fetching blogs" + error.message,{
            status: 500
        })
    }
}