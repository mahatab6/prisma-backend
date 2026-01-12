import { Request, Response } from "express";
import { PostService } from "./post.services";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized",
      });
    }
    const result = await PostService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: "post creation filed",
      details: error,
    });
  }
};

const getPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;  
    const user_id = req.query.user_id as string
    const result = await PostService.getPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      user_id
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "post creation filed",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getPost,
};
