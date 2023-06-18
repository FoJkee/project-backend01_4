import {Response, Request, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {postService} from "../domain/post-service";
import {authorizeMiddleware} from "../middleware/authorize";
import {blogsMiddleware} from "../middleware/blogs-middleware";
import {errorsMessages} from "../middleware/errors-messages";
import {repositoryBlogsDb} from "../repositories/repository-blogs-db";
import {repositoryPostsDb} from "../repositories/repository-posts-db";


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

//   {id}?????
routingBlogs.get('/', async (req: Request, res: Response) => {
    const blogsGetPost = await postService.findPosts()
    if (blogsGetPost) {
        res.status(200).json(blogsGetPost)
    } else {
        res.sendStatus(404)
    }
    const blogsFindId = await repositoryBlogsDb.findBlogsId(req.params.id)

    if (blogsFindId) {
        res.status(200).json(repositoryPostsDb.findIdPosts(req.params.id))
    } else {
        res.sendStatus(404)
    }


})

//   {id}?????
routingBlogs.post('/', authorizeMiddleware, blogsMiddleware, errorsMessages, async (req: Request, res: Response) => {
    const blogsCreatePost = await postService.createPosts(req.body.title,
        req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogName)

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

})