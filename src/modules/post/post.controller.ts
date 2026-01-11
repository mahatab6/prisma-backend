import { Request, Response } from "express";
import { PostService } from "./post.services";


const createPost = async (req: Request, res: Response) => {
    try {
        const result = await PostService.createPost(req.body)
        res.status(201).json(result)

    } catch (error) {
        res.status(400).json({
            message: "post creation filed",
            details: error
        })
    }
}

export const PostController = {
    createPost
}