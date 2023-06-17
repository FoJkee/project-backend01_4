import express, {Request, Response} from "express"
import bodyParser from "body-parser"
import {routingBlogs} from "./routing/routing-blogs";
import {routingTesting} from "./routing/routing-testing";
import {routingPosts} from "./routing/routing-posts";
import {runDb} from "./setting/db";


const app = express()

const port = 4000
const parseMiddleware = express.json()

app.use(bodyParser())
app.use(parseMiddleware)


app.use("/blogs", routingBlogs)
app.use("/testing", routingTesting)
app.use("/posts", routingPosts)


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

const startApp = async () => {

    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

}
startApp()


