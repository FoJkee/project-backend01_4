import {Router, Request, Response} from "express";
import {repositoryPostsDb} from "../repositories/repository-posts-db";


export const routingPosts = Router()


routingPosts.get("/", async (req: Request, res: Response) => {

    const postGet = await repositoryPostsDb.findPosts()

    res.status(200).json(postGet)
})

routingPosts.post("/", async (req: Request, res: Response) => {

    const postCreate = await repositoryPostsDb.createPosts(req.body.title,
        req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName)

    res.status(201).json(postCreate)

})

routingPosts.get("/:id", async (req: Request, res: Response) => {
    const postGetId = await repositoryPostsDb.findIdPosts(req.params.id)
    if (postGetId) {
        res.status(200).json(postGetId)
    } else {
        res.sendStatus(404)
    }
})

routingPosts.put("/:id", async (req: Request, res: Response) => {
    const postPutId = await repositoryPostsDb.findIdPosts(req.params.id)
    if (!postPutId) {
        res.sendStatus(404)
    } else {
        res.status(204).json(postPutId)
    }
    const postPut = await repositoryPostsDb.updatePosts(req.params.id,
        req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

})

routingPosts.delete("/:id", async (req: Request, res: Response) => {
    const postDeleteId = await repositoryPostsDb.findIdPosts(req.params.id)
    if (!postDeleteId) {
        res.sendStatus(404)
        return
    }

    const postDelete = await repositoryPostsDb.deletePosts(req.params.id)
    res.sendStatus(204)

})

