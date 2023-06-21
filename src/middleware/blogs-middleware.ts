import {body} from "express-validator";


const pattern = "^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$"


export const blogsMiddleware = [
    body('name').exists().withMessage('Incorrect name').isString()
        .isLength({min: 1, max: 15}).withMessage('String length is not more than 15 symbols'),
    body('description').exists().isString().isLength({
        min: 1,
        max: 500
    }).withMessage('String length is not more than 500 symbols'),
    body('websiteUrl').exists().isString().isLength({
        min: 1,
        max: 100
    }).withMessage("String length is not more than 100 symbols").matches(pattern).withMessage('Incorrect websiteUrl')

]
