import {BlogViewType, PaginatedType, PostType, PostViewType} from "../setting/types";
import {blogsCollection, postsCollection} from "../setting/db";
import {ObjectId, WithId} from "mongodb";



export const queryRepositoryBlogs = {

    async findBlogs(pageSize: number, pageNumber: number, sortDirection: string, sortBy: string):
        Promise<PaginatedType<BlogViewType>> {



        const result = await blogsCollection
            .find()
            .sort({[sortBy]: sortDirection === "desc" ? 1 : -1})
            .skip((pageSize) * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemsBlog: BlogViewType[] = result.map(el => ({
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }))

        const totalCount = await blogsCollection.countDocuments()

        const pageCount = Math.ceil(totalCount / pageSize)


        const response: PaginatedType<BlogViewType> = {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: itemsBlog
        }
        return response

    },

    async createPostForBlog(title: string, shortDescription: string, content: string,
                            blogId: string): Promise<PostViewType | null> {

        const createPostForBlogResult = await blogsCollection.findOne({_id: new ObjectId(blogId)})

        if (!createPostForBlogResult) {
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


    async findPostForBlog(pageNumber: number, pageSize: number, sortDirection: string, sortBy: string): Promise<PaginatedType<PostViewType>> {

        const result = await postsCollection
            .find({})
            .sort({[sortBy]: sortDirection === "desc" ? 1 : -1})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()


        const postForBlog: PostViewType[] = result.map(el => ({

            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt

        }))
        const totalCount = await postsCollection.countDocuments()


        const pageCount = Math.ceil(totalCount / pageSize)


        const response: PaginatedType<PostViewType> = {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: postForBlog
        }

        return response

    },


}













