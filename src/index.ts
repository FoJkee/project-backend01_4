import express, {Request, Response} from "express"
import bodyParser from "body-parser"



const app = express()

const port = process.env || 4000
const parseMiddleware = express.json()

app.use(bodyParser())
app.use(parseMiddleware)


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

//Todo connect bd
const starApp = async () => {



    // await runDb()



}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

