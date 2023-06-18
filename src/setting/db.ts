import dotenv from "dotenv"
import {MongoClient, WithId} from "mongodb";
import {BlogType, PostType} from "./types";

dotenv.config()



const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"

console.log(mongoUri)

if(!mongoUri){
    throw new Error('Not')
}

const client = new MongoClient(mongoUri)

const db = client.db('social_network')

export const postsCollection = db.collection<WithId<PostType>>('posts')
export const blogsCollection = db.collection<WithId<BlogType>>('blogs')


export  async function runDb() {
    try {
      await client.connect()
        console.log('Connection success')
    } catch {
        console.log("Can't connect to db")
        await client.close()
    }

}