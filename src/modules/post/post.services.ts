import { Post } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const createPost = async (payload: Post) => {
    console.log(payload)
    const result = await prisma.post.create({
        data: payload
    })
    return result;
}

export const PostService = {
    createPost
}