import {Response,Request,NextFunction} from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import { Packet } from "../library/Packet"

dotenv.config()

interface CustomRequest extends Request{
    token: string | JwtPayload
}


export default function UserAuth(req:Request,res:Response,next:NextFunction){
    try {
        const token=req.header("Authorization").split(" ")[1]
        
        if(token){
            let decodedData= <any>jwt.verify(token,process.env.SECURE_KEY);
            (req as CustomRequest).token=decodedData
        }
        next()
    } catch (error) {
        res.status(401).json(Packet("Not Authorized"))
    }
}