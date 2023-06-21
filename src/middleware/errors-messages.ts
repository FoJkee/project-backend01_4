import {NextFunction, Response, Request} from "express";
import {validationResult} from "express-validator";


export const errorsMessages = (req: Request, res: Response, next: NextFunction) => {



    const errMes = ({msg, path}: any)  => {

        return {
            message: msg,
            field: path
        }
    }


    const result = validationResult(req).formatWith(errMes)

    if (!result.isEmpty()) {
        res.status(400).json({errorsMessages: result.array({onlyFirstError: true})})
    } else {
        next()
    }

}
