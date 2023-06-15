import {postsCollection} from "../setting/db";
import {PostsViewType, PostType} from "../setting/types";
import {ObjectId, WithId} from "mongodb";
import {repositoryPostsDb} from "../repositories/repository-posts-db";


export const postService = {


    async findPosts(): Promise<PostsViewType[]> {
        return await repositoryPostsDb.findPosts()
    },

    async createPosts(title: string, shortDescription: string, content: string,
                      blogId: string, blogName: string): Promise<PostsViewType> {

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

    async findIdPosts(id: string): Promise<PostsViewType | null> {
        return  await repositoryPostsDb.findIdPosts(id)


    },
    async updatePosts(id: string, title: string, shortDescription: string,
                      content: string, blogId: string): Promise<boolean> {
        return await repositoryPostsDb.updatePosts(id, title,shortDescription,content,blogId)

    },

    async deletePosts(id: string): Promise<boolean> {
        return await repositoryPostsDb.deletePosts(id)


    },

    async deletePostsAll(): Promise<boolean> {
        return  await repositoryPostsDb.deletePostsAll()

    }

}



