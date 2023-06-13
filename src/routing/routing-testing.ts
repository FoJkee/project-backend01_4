import {Response, Request, Router} from "express";


export const routingTesting = Router()




routingTesting.delete("/all-data", async (req: Request, res:Response) => {



    res.status(204)
})