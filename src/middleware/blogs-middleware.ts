import {body, query} from "express-validator";


const pattern = "^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$"


export const blogsMiddleware = [
    body('name').exists().trim().withMessage('Incorrect name').isString()
        .isLength({min: 1, max: 15}).withMessage('String length is not more than 15 symbols'),
    body('description').exists().trim().isString().isLength({
        min: 1,
        max: 500
    }).withMessage('String length is not more than 500 symbols'),
    body('websiteUrl').exists().trim().isString().isLength({
        min: 1,
        max: 100
    }).withMessage("String length is not more than 100 symbols").matches(pattern).withMessage('Incorrect websiteUrl')

]

export const blogsMiddlewareA = [
    query('pageNumber').optional().isInt().default(10).custom((val, {req}) => {
        if (val <= 0) {
            req.query!.pageNumber = 10
            return true
        }
        return true
    }),

    query('pageSize').optional().isInt().default(1).custom((val, {req}) => {
        if (val <= 0) {
            req.query!.pageSize = 1
            return true
        }
        return true

    }),
    query('sortDirection').optional().isString().default('desc').custom((val, {req}) => {
        if (val === 'desc') {
            req.query!.sortDirection = 1
            return true
        }

        return true
    }),
    query('sortBy').optional().isString().default('createdAt').custom((val, {req}) => {

        if (val === 'createdAt') {
            req.query!.sortBy = 'createdAt'
            return true
        }
        return true
    })

]
