import connect from "@/lib/db"
import User from "@/lib/models/users"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

const ObjectId = require("mongoose").Types.ObjectId

export const GET = async ()=>{
    try {
        await connect()
        const users = await User.find()
        return new NextResponse(JSON.stringify(users), {status: 200})
    } catch (error: any) {
        return new NextResponse(`Error in fetching users ${error.message}`, {status: 500})
    }
   
}

export const POST = async (request: Request)=>{
    try {
        const body = await request.json()
        await connect()
        const newUSer =  new User(body)
        await newUSer.save();

        return new NextResponse(JSON.stringify({message: "User created", user: newUSer }), {status: 201})
    } catch (error: any) {
        return new NextResponse(`Error in creating user ${error.message}`, {
            status: 500
        })
    }
}

export const PATCH = async (request: Request)=>{
    try {
        const body = await request.json()
        const {userId, newUsername} = body

        await connect()

        if(!userId || !newUsername){
            return new NextResponse(
                JSON.stringify({message: "ID and username is required"}),
                {status: 400}
            )
        }

        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid user id"}),
                {status: 400}
            )
        }

        const updatedUser = await User.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true}
        )

        if(!updatedUser){
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}),
                {status: 404}
            )
        }

        return new NextResponse(
            JSON.stringify({message: "User is updated", user: updatedUser}),
            {status: 200}
        )
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({message: `Error updating user ${error.message}`}),
            {status: 500}
        )
    }
}

export const DELETE = async (request: Request)=>{
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if(!userId){
            return new NextResponse(
                JSON.stringify({message: "userId is required"}),
                {status: 400}
            )
        }

        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid user id"}),
                {status: 400}
            )
        }

        await connect()

        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId))

        if(!deletedUser){
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}),
                {status: 404}
            )
        }

        return new NextResponse(
            JSON.stringify({message: "User is deleted", user: deletedUser}),
            {status: 200}
        )


    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({message: `Error deleting user ${error.message}`}),
            {status: 500}
        )
    }
}