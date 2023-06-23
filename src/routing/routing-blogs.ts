import {Response, Request, Router, query, NextFunction} from "express";
import {blogsService} from "../domain/blogs-service";
import {authorizeMiddleware} from "../middleware/authorize";
import {blogsMiddleware} from "../middleware/blogs-middleware";
import {errorsMessages} from "../middleware/errors-messages";
import {blogPostMiddleware} from "../middleware/post-middleware";
import {queryRepositoryBlogs} from "../repositories/query-repository-blogs";
import {repositoryBlogsDb} from "../repositories/repository-blogs-db";
import {PaginatedType, Pagination, PaginationView, SearchQuery, SearchQueryView} from "../setting/types";


// export const paginatorBlogs = (query: SearchQueryView): PaginationView => {
//
//     return {
//         pageSize: query.pageSize ?? 10,
//         pageNumber: query.pageNumber ?? 1,
//         sortDirection: query.sortDirection ?? 'desc',
//         sortBy: query.sortBy ?? 'createdAt',
//         searchNameTerm: query.searchNameTerm ?? null
//     }
// }

// export const paginatorBlogs2 = (query: SearchQueryView): PaginationView => {
//     return {
//         pageSize: query.pageSize ?? 10,
//         pageNumber: query.pageNumber ?? 1,
//         sortDirection: query.sortDirection ?? 'desc',
//         sortBy: query.sortBy ?? 'createdAt',
//         searchNameTerm: query.searchNameTerm ?? null
//     }
// }
//
// export const paginatorPost = (query: SearchQuery): Pagination => {
//     return PaginationDefaultValues(query)
// }

// const blogsQuery = (req: Request, res: Response, next: NextFunction) => {
//     const pagination = paginator(req.query)
//
//     Object.keys(pagination).map(el => [
//         req.query[el] = pagination[el]
//     ])
//
//     next()
// }


export const PaginationDefaultValuesPost = (query: SearchQuery): Pagination => {

    const defaultValues: Pagination = {
        pageSize: 10,
        pageNumber: 1,
        sortDirection: 'desc',
        sortBy: 'createdAt',
    }

    if (query.pageSize && !isNaN(parseInt(query.pageSize, 10)) && parseInt(query.pageSize, 10) >= 1) {
        defaultValues.pageSize = parseInt(query.pageSize, 10)
    }
    if (query.pageNumber && !isNaN(parseInt(query.pageNumber, 10)) && parseInt(query.pageNumber, 10) >= 1) {
        defaultValues.pageNumber = parseInt(query.pageNumber, 10)
    }
    if (query.sortDirection && query.sortDirection === 'asc') {
        defaultValues.sortDirection = 'asc'
    }
    if (query.sortBy) {
        defaultValues.sortBy = query.sortBy
    }
    return  defaultValues
}

export const PaginationDefaultValuesBlog = (query: SearchQueryView): PaginationView => {

    const defaultValues: PaginationView = {
        pageSize: 10,
        pageNumber: 1,
        sortDirection: 'desc',
        sortBy: 'createdAt',
        searchNameTerm: null
    }

    if (query.pageSize && !isNaN(parseInt(query.pageSize, 10)) && parseInt(query.pageSize, 10) >= 1) {
        defaultValues.pageSize = parseInt(query.pageSize, 10)
    }
    if (query.pageNumber && !isNaN(parseInt(query.pageNumber, 10)) && parseInt(query.pageNumber, 10) >= 1) {
        defaultValues.pageNumber = parseInt(query.pageNumber, 10)
    }
    if (query.sortDirection && query.sortDirection === 'asc') {
        defaultValues.sortDirection = 'asc'
    }
    if (query.sortBy) {
        defaultValues.sortBy = query.sortBy
    }
    if(query.searchNameTerm){
        defaultValues.searchNameTerm = query.searchNameTerm
    }
    return  defaultValues
}




export const routingBlogs = Router()

routingBlogs.get('/', async (req: Request<{}, {}, {}, SearchQueryView>,
                             res: Response) => {



        const blogsGet = await queryRepositoryBlogs.findBlogs(PaginationDefaultValuesBlog(req.query))
        return res.status(200).json(blogsGet)
    }
)


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

    const blogsFindPost = await queryRepositoryBlogs.findPostForBlog(PaginationDefaultValuesPost(req.query), req.params.id)

    if (blogsFindPost) {
        res.status(200).json(blogsFindPost)
        return
    }
})


routingBlogs.post('/:id/posts', authorizeMiddleware, blogPostMiddleware,
    errorsMessages, async (req: Request, res: Response) => {
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


routingBlogs.put('/:id', authorizeMiddleware, blogsMiddleware, errorsMessages,
    async (req: Request, res: Response) => {
        const blogsPutId = await blogsService.findBlogsId(req.params.id)
        if (!blogsPutId) {
            res.sendStatus(404)
        } else {
            res.status(204).json(blogsPutId)
        }
        const blogsPut = await blogsService.updateBlogs(req.params.id,
            req.body.name, req.body.description, req.body.websiteUrl)

    })

routingBlogs.delete('/:id', authorizeMiddleware, blogsMiddleware,
    async (req: Request, res: Response) => {
        const blogsDeleteId = await blogsService.findBlogsId(req.params.id)
        if (!blogsDeleteId) {
            res.sendStatus(404)
            return
        }

        const blogsDelete = await blogsService.deleteBlogs(req.params.id)
        res.sendStatus(204)
    })