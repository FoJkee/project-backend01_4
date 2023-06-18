import {Response, Request, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {postService} from "../domain/post-service";


export const routingTesting = Router()


routingTesting.delete("/all-data", async (req: Request, res: Response) => {
    await blogsService.deleteBlogsAll()
    await postService.deletePostsAll()
    res.status(204)
})