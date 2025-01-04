import { NextRequest, NextResponse } from "next/server"
import os from 'os'
import path from "path"
import fs from 'fs'

export const GET = (request: Request)=>{
    // console.log(os.type())
    // console.log(os.version())
    // console.log(os.homedir())

    console.log(path.dirname(__filename))
    console.log(path.basename(__filename))
    console.log(path.extname(__filename))
    console.log(path.parse(__filename))

    // fs.writeFile(path.join(__dirname, 'files', 'lorem.txt'), 'utf8', (err: any, data)=>{
    //     if(err){
    //         console.log(err)
    //         return
    //     }
    //     console.log(data)

    // })

    return new NextResponse(JSON.stringify("Hello"))
}