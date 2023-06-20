import {BlogViewType} from "../setting/types";
import {ObjectId} from "mongodb";
import {repositoryBlogsDb} from "../repositories/repository-blogs-db";

export const blogsService = {

    async createBlogs(name: string, description: string, websiteUrl: string): Promise<BlogViewType> {

        const createBlog = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: (new Date()).toISOString(),
            isMembership: false
        }

        return await repositoryBlogsDb.createBlogs(createBlog)

    },

    async findBlogsId(id: string): Promise<BlogViewType | null> {
        return await repositoryBlogsDb.findBlogsId(id)

    },

    async updateBlogs(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await repositoryBlogsDb.updateBlogs(id, name, description, websiteUrl)
    },

    async deleteBlogs(id: string): Promise<boolean | null> {
        return await repositoryBlogsDb.deleteBlogs(id)

    },

    async deleteBlogsAll() {
        return await repositoryBlogsDb.deleteBlogsAll()
    }


}