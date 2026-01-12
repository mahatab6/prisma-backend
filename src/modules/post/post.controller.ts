import { Request, Response } from "express";
import { PostService } from "./post.services";

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
    const {search} = req.query
    const searchString = typeof search === "string" ? search : undefined
    const result = await PostService.getPost({search: searchString});
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({
      message: "post creation filed",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getPost
};
