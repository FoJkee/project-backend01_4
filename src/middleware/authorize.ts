import {Request, Response,NextFunction} from "express";


export const authorizeMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const code = await Buffer.from('admin:qwerty', 'utf-8').toString('base64')

    if(req.headers.authorization === `Bacis ${code}`){
        next()
    } else {
        res.sendStatus(401)

    }

}