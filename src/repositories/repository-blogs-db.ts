import {BlogType, BlogViewType, PaginatedType, PostType, PostViewType} from "../setting/types";
import {blogsCollection, postsCollection} from "../setting/db";
import {ObjectId, WithId} from "mongodb";


export const repositoryBlogsDb = {

    async findBlogs():
        Promise<PaginatedType<BlogViewType>> {
        const result = await blogsCollection.find({}).toArray()

        const itemsBlog: BlogViewType[] = result.map(el => ({
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }))



        const response: PaginatedType<BlogViewType> = {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: itemsBlog
        }
        return response
    },

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

    async createPostForBlog(title: string, shortDescription: string, content: string,
                            blogId: string): Promise<PostViewType | null> {

        const createPostForBlogResult = await blogsCollection.findOne({_id: new ObjectId(blogId)})

        if(!createPostForBlogResult){
            return null
        }

        const createPostInBlog: WithId<PostType> = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: createPostForBlogResult._id.toString(),
            blogName: createPostForBlogResult.name,
            createdAt: new Date().toISOString()
        }

        const result = await postsCollection.insertOne(createPostInBlog)
        return {
            id: result.insertedId.toString(),
            title: createPostInBlog.title,
            shortDescription: createPostInBlog.shortDescription,
            content: createPostInBlog.content,
            blogId: blogId,
            blogName: createPostInBlog.blogName,
            createdAt: createPostInBlog.createdAt
        }

    },


    async findPostForBlog(): Promise<PaginatedType<PostViewType>> {

        const result = await postsCollection.find({}).toArray()

        const postForBlog: PostViewType[] = result.map(el => ({

            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt

        }))

        const response: PaginatedType<PostViewType> = {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: postForBlog
        }

        return response

    },


    async findBlogsId(id: string): Promise<BlogViewType | null> {

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