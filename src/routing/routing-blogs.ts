import {Response, Request, Router, query} from "express";
import {blogsService} from "../domain/blogs-service";
import {authorizeMiddleware} from "../middleware/authorize";
import {blogsMiddleware, blogsMiddlewareA} from "../middleware/blogs-middleware";
import {errorsMessages} from "../middleware/errors-messages";
import {blogPostMiddleware} from "../middleware/post-middleware";
import {queryRepositoryBlogs} from "../repositories/query-repository-blogs";
import {repositoryBlogsDb} from "../repositories/repository-blogs-db";


// const paginator3 = (query: any) => {
//     return {
//         pageSize: query.pageSize ? ,
//         pageNumber: 1,
//         sortDirection: 'desc',
//         sortBy: 'createdAt'
//     }
// }


export const paginator2 = (query: any) => {

    const defaultValues = {

        pageSize: 10,
        pageNumber: 1,
        sortDirection: 'desc',
        sortBy: 'createdAt'
    }

    if (query.pageSize) {
        const pageSize = parseInt(query.pageSize, 10)
        const pageNumber = parseInt(query.pageNumber, 10)
        const sortDirection = query.sortDirection ? 'desc' : 'asc'
        const sortBy = query.sortBy ? 'createdAt' : ''
        if (!pageSize) defaultValues.pageSize = defaultValues.pageSize
        if (isNaN(pageSize)) defaultValues.pageSize = defaultValues.pageSize
        if (pageSize <= 0) defaultValues.pageSize = defaultValues.pageSize

        if (!pageNumber) defaultValues.pageNumber = pageNumber
        if (isNaN(pageNumber)) defaultValues.pageNumber = defaultValues.pageNumber
        if (pageNumber <= 0) defaultValues.pageNumber = defaultValues.pageNumber


        defaultValues.pageSize = pageSize
        defaultValues.pageNumber = pageNumber
        defaultValues.sortDirection = sortDirection
        defaultValues.sortBy = sortBy
    }

    return query.pageSize, query.pageNumber, query.sortDirection, query.sortBy

}


// const paginator = (query: PaginatorPayloadType): PaginatorResponseType => {
//
//     const pageSize = !isNaN(Number(query.pageSize)) ? Number(query.pageSize) : 10
//     const  pageNumber = !isNaN(Number(query.pageNumber)) ? Number(query.pageNumber) : 1
//     const sortDirection = query.sortDirection ? 'desc' : 'asc'
//     const sortBy = query.sortBy ? 'createdAt' : ''
//
//
//     return  {
//         pageSize: query.pageSize ? Number(query.pageSize) : 10,
//         pageNumber: query.pageNumber ? Number(query.pageSize) : 1,
//         sortDirection: query.sortDirection ? query.sortDirection : 'desc',
//         sortBy: query.sortBy ? query.sortBy : 'createdAt'
//     }
// }

export const routingBlogs = Router()

routingBlogs.get('/', async (req: Request, res: Response) => {
    const pagination = paginator2(req.query)
    const blogsGet = await queryRepositoryBlogs.findBlogs(pagination)
    res.status(200).json(blogsGet)
})


routingBlogs.post('/', authorizeMiddleware, blogsMiddleware, errorsMessages,
    async (req: Request, res: Response) => {

        const blogsCreate = await blogsService.createBlogs(
            req.body.name,
            req.body.description,
            req.body.websiteUrl
        )
        res.status(201).json(blogsCreate)

    })


routingBlogs.get('/:id/posts', async (req: Request, res: Response) => {
    const blogFindForId = await repositoryBlogsDb.findBlogsId(req.params.id)
    if (!blogFindForId) {
        res.sendStatus(404)
        return
    }
    const pagination = paginator2(req.query)

    const blogsFindPost = await queryRepositoryBlogs.findPostForBlog(pagination)

    if (blogsFindPost) {
        res.status(200).json(blogsFindPost)
        return
    }
})

routingBlogs.post('/:id/posts', authorizeMiddleware, blogPostMiddleware, errorsMessages, async (req: Request, res: Response) => {
    const blogFindForId = await repositoryBlogsDb.findBlogsId(req.params.id)
    if (!blogFindForId) {
        res.sendStatus(404)
        return
    }

    const blogsCreatePost = await queryRepositoryBlogs.createPostForBlog(req.body.title,
        req.body.shortDescription, req.body.content, req.params.id)

    if (blogsCreatePost) {
        res.status(201).json(blogsCreatePost)
        return
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
    res.sendStatus(204)
})