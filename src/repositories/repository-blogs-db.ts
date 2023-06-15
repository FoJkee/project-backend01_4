import {BlogsType, BlogsViewType} from "../setting/types";
import {blogsCollection} from "../setting/db";
import {ObjectId} from "mongodb";


export const repositoryBlogsDb = {

    async findBlogs(): Promise<BlogsViewType[]> {
        const result = await blogsCollection.find({}).toArray()
        return result.map(el => ({
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }))
    },


// Todo any?
    async createBlogs(createBlog: any): Promise<BlogsViewType> {

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

    async findBlogsId(id: string): Promise<BlogsViewType | null> {
        const blogsGetId = await blogsCollection.findOne({_id: new ObjectId(id)})

        if (blogsGetId) {
            return {
                id: blogsGetId._id.toString(),
                name: blogsGetId.name,
                description: blogsGetId.description,
                websiteUrl: blogsGetId.websiteUrl,
                createdAt: new Date().toString(),
                isMembership: false
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