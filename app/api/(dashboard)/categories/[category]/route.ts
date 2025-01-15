import connect from "@/lib/db"
import User from "@/lib/models/users"
import Category from "@/lib/models/category"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, context: {params: any})=>{
    const categoryId = (await context.params).category
    try {
        const body  = await request.json()
        const {title} = body

        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}),
                {status: 400}
            )
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing categoryId"}),
                {status: 400}
            )
        }
        await connect()

        const user = await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message: "user not found"}), {status: 400})
        }

        const category = await Category.findOne({_id: categoryId, user: userId})

        if(!category){
            return new NextResponse(JSON.stringify({message: "Category not found"}), {status: 404})

        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {title}, {new: true})

        return new NextResponse(JSON.stringify({
            message: "Category is updated",
            category: updatedCategory
        }),
        {status: 200}
    )


    } catch (error: any) {
        return new NextResponse(JSON.stringify("Error in updating category"),
        {
            status: 500
        }
    )
        
    }

}

export const DELETE = async (req: Request, context: {params: any})=>{
    const categoryId = (await context.params).category
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId") 


        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}),
                {status: 400}
            )
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing categoryId"}),
                {status: 400}
            )
        }
        await connect()

        const user = await User.findById(userId)
        if(!user){
            return new NextResponse(
                JSON.stringify({message: "User not found"})
            )
        }

        const category = await Category.findOne({_id: categoryId, user: userId})
        if(!category){
            return new NextResponse(
                JSON.stringify({message: "category not found or does not belob]ng to the user"}),
                {status: 404}
            )
        }

        await  Category.findByIdAndDelete(categoryId)
        return new NextResponse(
            JSON.stringify({message: "Category is deleted"}),
            {status: 200}
        )
    } catch (error) {
        return new NextResponse(JSON.stringify("Error in updating category"),
        {
            status: 500
        }
    )
    }
}