import {PaginatedType, Pagination, PostViewType} from "../setting/types";
import {ObjectId} from "mongodb";
import {repositoryPostsDb} from "../repositories/repository-posts-db";


export const postService = {


    async findPosts(paginator: Pagination): Promise<PaginatedType<PostViewType>> {
        return await repositoryPostsDb.findPosts(paginator)
    },

    async createPosts(title: string, shortDescription: string, content: string,
                      blogId: string, blogName: string): Promise<PostViewType> {

        const createPost = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }

        return await repositoryPostsDb.createPosts(createPost)

    },


    async findIdPosts(id: string): Promise<PostViewType | null> {
        return await repositoryPostsDb.findIdPosts(id)


    },
    async updatePosts(id: string, title: string, shortDescription: string,
                      content: string, blogId: string): Promise<boolean> {
        return await repositoryPostsDb.updatePosts(id, title, shortDescription, content, blogId)

    },

    async deletePosts(id: string): Promise<boolean> {
        return await repositoryPostsDb.deletePosts(id)


    },

    async deletePostsAll() {
        return await repositoryPostsDb.deletePostsAll()

    }

}



