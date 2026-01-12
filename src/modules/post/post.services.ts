import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createAt" | "updatedAt" | "user_id">,
  userId: string
) => {
  console.log(data, userId);
  const result = await prisma.post.create({
    data: {
      ...data,
      user_id: userId,
    },
  });
  return result;
};

const getPost = async (payload: {
  search: string | undefined;
  tags: string[];
  isFeatured: boolean | undefined;
  status: PostStatus
}) => {


    const andConditions: PostWhereInput[] = [];

    if(payload.search){
        andConditions.push(
            {
          OR: [
            {
              title: {
                contains: payload.search as string,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: payload.search as string,
                mode: "insensitive",
              },
            },
            {
              tags: {
                has: payload.search as string,
              },
            },
          ],
        }
        )
    }

    if(payload.tags.length > 0) {
        andConditions.push(
            {
          tags: {
            hasEvery: payload.tags as string[],
          },
        }
        )
    }

    if (typeof payload.isFeatured === 'boolean') {
        andConditions.push({
            isFeatured: payload.isFeatured as boolean
        })
    }

    if(payload.status){
        andConditions.push({
            status: payload.status as PostStatus
        })
    }

  const result = await prisma.post.findMany({
    where: {
      AND: andConditions
    },
  });
  return result;
};

export const PostService = {
  createPost,
  getPost,
};
