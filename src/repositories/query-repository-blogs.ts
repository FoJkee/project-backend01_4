import {BlogViewType, PaginatedType, PostType, PostViewType} from "../setting/types";
import {blogsCollection, postsCollection} from "../setting/db";
import {ObjectId, WithId} from "mongodb";


function sortBy(sortDirection: string) {
    return sortDirection === 'desc' ? -1 : 1
}


function skipp(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * (+pageSize)
}

export const queryRepositoryBlogs = {

    async findBlogs(pageSize: string, pageNumber: string, sortDirection: string):
        Promise<PaginatedType<BlogViewType>> {

        const result = await blogsCollection.find({})
            .sort(sortBy(sortDirection))
            .skip(skipp(pageNumber, pageSize))
            .limit(+pageSize)
            .toArray()

        const itemsBlog: BlogViewType[] = result.map(el => ({
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }))

        const pageCount = Math.ceil((+itemsBlog.length) / (+pageSize))


        const response: PaginatedType<BlogViewType> = {
            pagesCount: pageCount.toString(),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: itemsBlog.length.toString(),
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


    async findPostForBlog(pageNumber: string, pageSize: string, sortDirection: string): Promise<PaginatedType<PostViewType>> {

        const result = await postsCollection.find({})
            .sort(sortBy(sortDirection))
            .skip(skipp(pageNumber, pageSize))
            .limit(+pageSize)
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
        const pageCount = Math.ceil(+postForBlog.length / +pageSize)


        const response: PaginatedType<PostViewType> = {
            pagesCount: pageCount.toString(),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postForBlog.length.toString(),
            items: postForBlog
        }

        return response

    },


}













