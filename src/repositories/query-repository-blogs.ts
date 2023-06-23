import {
    BlogType,
    BlogViewType,
    PaginatedType,
    Pagination,
    PaginationView,
    PostType,
    PostViewType
} from "../setting/types";
import {blogsCollection, postsCollection} from "../setting/db";
import {Filter, ObjectId, WithId} from "mongodb";



export const queryRepositoryBlogs = {

    async findBlogs(pagination: PaginationView):
        Promise<PaginatedType<BlogViewType>> {

        const filter: Filter<BlogType> = {name: {$regex: pagination.searchNameTerm ?? '', $options: 'i'}}


        const result = await blogsCollection
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection === "desc" ? -1 : 1})
            .skip((pagination.pageSize) * (pagination.pageNumber - 1))
            .limit(pagination.pageSize)
            .toArray()

        const itemsBlog: BlogViewType[] = result.map(el => ({
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }))

        const totalCount = await blogsCollection.countDocuments(filter)

        const pageCount = Math.ceil(totalCount / pagination.pageSize)


        const response: PaginatedType<BlogViewType> = {
            pagesCount: pageCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
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


    async findPostForBlog(pagination: Pagination, id: string): Promise<PaginatedType<PostViewType>> {

        const filter = {blogId: id}

        const result = await postsCollection
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection === "desc" ? -1 : 1})
            .skip(pagination.pageSize * (pagination.pageNumber - 1))
            .limit(pagination.pageSize)
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
        const totalCount = await postsCollection.countDocuments(filter)


        const pageCount = Math.ceil(totalCount / pagination.pageSize)


        const response: PaginatedType<PostViewType> = {
            pagesCount: pageCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items: postForBlog
        }

        return response

    },


}













