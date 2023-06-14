import {Response, Request, Router} from "express";
import {repositoryBlogsDb} from "../repositories/repository-blogs-db";
import {repositoryPostsDb} from "../repositories/repository-posts-db";


export const routingTesting = Router()


routingTesting.delete("/all-data", async (req: Request, res: Response) => {
    await repositoryBlogsDb.deleteBlogsAll()
    await repositoryPostsDb.deletePostsAll()
    res.status(204)
})