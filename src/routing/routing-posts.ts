import {Router, Request, Response} from "express";
import {postService} from "../domain/post-service";
import {postMiddleware} from "../middleware/post-middleware";
import {authorizeMiddleware} from "../middleware/authorize";
import {errorsMessages} from "../middleware/errors-messages";
import {PaginationDefaultValuesPost} from "./routing-blogs";


export const routingPosts = Router()


routingPosts.get("/", async (req: Request, res: Response) => {

    const postGet = await postService.findPosts(PaginationDefaultValuesPost(req.query))

    return res.status(200).json(postGet)
})

routingPosts.post("/", authorizeMiddleware, postMiddleware, errorsMessages, async (req: Request, res: Response) => {

    const postCreate = await postService.createPosts(req.body.title,
        req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName)

    res.status(201).json(postCreate)

})

routingPosts.get("/:id", async (req: Request, res: Response) => {
    const postGetId = await postService.findIdPosts(req.params.id)
    if (postGetId) {
        res.status(200).json(postGetId)
    } else {
        res.sendStatus(404)
    }
})

routingPosts.put("/:id", authorizeMiddleware, postMiddleware, errorsMessages, async (req: Request, res: Response) => {
    const postPutId = await postService.findIdPosts(req.params.id)
    if (!postPutId) {
        res.sendStatus(404)
    } else {
        res.status(204).json(postPutId)
    }
    const postPut = await postService.updatePosts(req.params.id,
        req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

})

routingPosts.delete("/:id", authorizeMiddleware, postMiddleware, async (req: Request, res: Response) => {
    const postDeleteId = await postService.findIdPosts(req.params.id)
    if (!postDeleteId) {
        res.sendStatus(404)
        return
    }

    const postDelete = await postService.deletePosts(req.params.id)
    res.sendStatus(204)

})

