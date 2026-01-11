import express, { NextFunction, Request, Response, Router } from "express"
import { PostController } from "./post.controller";
import {auth as betterAuth} from "../../lib/auth"


const router = express.Router()

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request{
            user?:{
                id: string;
                email: string;
                name: string;
                role: string;
                emailverified: boolean;
            }
        }
    }
}



const auth = (...role:UserRole[]) => {
    return async(req:Request, res:Response, next:NextFunction ) =>{
        const session = await betterAuth.api.getSession({
            headers:req.headers as any
        })

        if(!session){
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            })
        }

        if(!session.user.emailVerified){
            return res.status(403).json({
                success: false,
                message: "Email verification required. Please verify your email"
            })
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as string,
            emailverified: session.user.emailVerified
        }

        if (role.length && !role.includes(req.user.role as UserRole)){
            return res.status(403).json({
                success: false,
                message: "Forbidden! You don't permisstion to acces this url"
            })
        }
        
        next()
    }
}



router.post('/',auth(UserRole.USER), PostController.createPost )

export const postRouter: Router = router;