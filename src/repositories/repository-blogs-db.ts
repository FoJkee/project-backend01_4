import {BlogType, BlogViewType} from "../setting/types";
import {blogsCollection} from "../setting/db";
import {ObjectId, WithId} from "mongodb";



export const repositoryBlogsDb = {

    async createBlogs(createBlog: WithId<BlogType>): Promise<BlogViewType> {


        const result = await blogsCollection.insertOne(createBlog)

        return {

            id: result.insertedId.toString(),
            name: createBlog.name,
            description: createBlog.description,
            websiteUrl: createBlog.websiteUrl,
            createdAt: createBlog.createdAt,
            isMembership: createBlog.isMembership
        }
    },


    async findBlogsId(id: string): Promise<BlogViewType | null> {

        const blogsGetId = await blogsCollection.findOne({_id: new ObjectId(id)})

        if (blogsGetId) {
            return {
                id: blogsGetId._id.toString(),
                name: blogsGetId.name,
                description: blogsGetId.description,
                websiteUrl: blogsGetId.websiteUrl,
                createdAt: blogsGetId.createdAt,
                isMembership: blogsGetId.isMembership
            }
        } else {

            return null

        }
    },


    async updateBlogs(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {

        const result = await blogsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl
                }
            })
        return result.matchedCount === 1

    },

    async deleteBlogs(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1

    },

    async deleteBlogsAll() {
        const result = await blogsCollection.deleteMany({})
        return result.deletedCount === 1

    }


}