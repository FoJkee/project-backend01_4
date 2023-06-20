import {body} from "express-validator";
import {queryRepositoryBlogs} from "../repositories/query-repository-blogs";


export const postMiddleware = [

    body('title').exists().isString().trim().isLength({
        min: 1,
        max: 30
    }).withMessage('String length is not more than 30 symbols'),
    body('shortDescription').exists().isString().trim().isLength({
        min: 1,
        max: 100
    }).withMessage('String length is not more than 100 symbols'),
    body('content').exists().isString().trim().isLength({
        min: 1,
        max: 1000
    }).withMessage('String length is not more than 1000 symbols'),
    body('blogId').exists().isString().isLength({min: 1, max: 100})
        .withMessage('Incorrect blogId')
        .custom(async (v, {req}) => {
            const blogsData = await queryRepositoryBlogs.findBlogs(req.body.pageSize, req.body.pageNumber)
            const blog = blogsData.items.find(b => b.id === v)
            if (!blog) throw new Error()
            req.body.blogName = blog.name
            return true
        })
]

export const blogPostMiddleware = [
    body('title').exists().isString().trim().isLength({
        min: 1,
        max: 30
    }).withMessage('String length is not more than 30 symbols'),
    body('shortDescription').exists().isString().trim().isLength({
        min: 1,
        max: 100
    }).withMessage('String length is not more than 100 symbols'),
    body('content').exists().isString().trim().isLength({
        min: 1,
        max: 1000
    }).withMessage('String length is not more than 1000 symbols'),
]


