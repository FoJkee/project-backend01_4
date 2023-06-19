import {Response, Request, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {authorizeMiddleware} from "../middleware/authorize";
import {blogsMiddleware} from "../middleware/blogs-middleware";
import {errorsMessages} from "../middleware/errors-messages";
import {repositoryBlogsDb} from "../repositories/repository-blogs-db";
import {blogPostMiddleware, postMiddleware} from "../middleware/post-middleware";


export const routingBlogs = Router()

routingBlogs.get('/', async (req: Request, res: Response) => {
    const blogsGet = await blogsService.findBlogs()
    res.status(200).json(blogsGet)
})
routingBlogs.post('/', authorizeMiddleware, blogsMiddleware, errorsMessages, async (req: Request, res: Response) => {
    const blogsCreate = await blogsService.createBlogs(req.body.name,
        req.body.description, req.body.websiteUrl)
    res.status(201).json(blogsCreate)
})


routingBlogs.get('/:id/posts', async (req: Request, res: Response) => {
    const blogsFindPost = await repositoryBlogsDb.findPostForBlog()
    if(blogsFindPost) {
        res.status(200).json(blogsFindPost)
    } else {
        res.sendStatus(404)
    }
})

//
routingBlogs.post('/:id/posts', authorizeMiddleware, blogPostMiddleware, errorsMessages, async (req: Request, res: Response) => {

    const blogsCreatePost = await repositoryBlogsDb.createPostForBlog(req.body.title,
        req.body.shortDescription, req.body.content, req.params.id)

    if (blogsCreatePost) {
        res.status(201).json(blogsCreatePost)
    } else {
        res.sendStatus(404)
    }

})


routingBlogs.get('/:id', async (req: Request, res: Response) => {
    const blogsGetId = await blogsService.findBlogsId(req.params.id)
    if (blogsGetId) {
        res.status(200).json(blogsGetId)
    } else {
        res.sendStatus(404)
    }

})

routingBlogs.put('/:id', authorizeMiddleware, blogsMiddleware, errorsMessages, async (req: Request, res: Response) => {
    const blogsPutId = await blogsService.findBlogsId(req.params.id)
    if (!blogsPutId) {
        res.sendStatus(404)
    } else {
        res.status(204).json(blogsPutId)
    }
    const blogsPut = await blogsService.updateBlogs(req.params.id,
        req.body.name, req.body.description, req.body.websiteUrl)

})

routingBlogs.delete('/:id', authorizeMiddleware, blogsMiddleware, async (req: Request, res: Response) => {
    const blogsDeleteId = await blogsService.findBlogsId(req.params.id)
    if (!blogsDeleteId) {
        res.sendStatus(404)
        return
    }

    const blogsDelete = await blogsService.deleteBlogs(req.params.id)
    res.sendStatus(201)
})