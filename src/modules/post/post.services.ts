import { Post } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"



const createPost = async (data: Omit<Post, 'id' | 'createAt' |  'updatedAt' | 'user_id'>, userId: string) => {
    console.log(data, userId)
    const result = await prisma.post.create({
        data: {
        ...data,
        user_id: userId
        }
    })
    return result;
}

export const PostService = {
    createPost
}