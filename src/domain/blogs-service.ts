import {BlogsType, BlogsViewType} from "../setting/types";
import {ObjectId} from "mongodb";
import {repositoryBlogsDb} from "../repositories/repository-blogs-db";
import {blogsMiddleware} from "../middleware/blogs-middleware";

export const blogsService = {

    async findBlogs(): Promise<BlogsViewType[]> {
        return repositoryBlogsDb.findBlogs()
    },

    async createBlogs(name: string, description: string, websiteUrl: string): Promise<BlogsType> {

        const createBlog = {
            id: ObjectId,
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await repositoryBlogsDb.createBlogs(createBlog)
        return createBlog
    },

    async findBlogsId(id: string): Promise<BlogsViewType | null> {
        return await repositoryBlogsDb.findBlogsId(id)

    },

    async updateBlogs(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await repositoryBlogsDb.updateBlogs(id , name, description, websiteUrl)
    },

    async deleteBlogs(id: string): Promise<boolean> {
        return  await repositoryBlogsDb.deleteBlogs(id)

    },

    async deleteBlogsAll() {
        return  await repositoryBlogsDb.deleteBlogsAll()
    }


}