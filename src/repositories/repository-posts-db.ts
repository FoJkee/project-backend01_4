import {postsCollection} from "../setting/db";
import {PaginatedType, PostType, PostViewType} from "../setting/types";
import {ObjectId, WithId} from "mongodb";

// function skipp(pageNumber: number, pageSize: number): number {
//     return (pageNumber - 1) * (pageSize)
// }

export const repositoryPostsDb = {


    async findPosts(pageNumber: string, pageSize: string, sortDirection: string, sortBy: string): Promise<PaginatedType<PostViewType>> {

        const result = await postsCollection.find({})
            .sort({[sortBy]: sortDirection === 'desc' ? 1 : -1})
            .skip(+pageSize * (+pageNumber - 1))
            .limit(+pageSize)
            .toArray()


        const itemsPost: PostViewType[] = result.map(el => ({
            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt
        }))

        const totalCount: number = await postsCollection.countDocuments()

        const pageCount: number = Math.ceil(totalCount / +pageSize)


        const response: PaginatedType<PostViewType> = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: itemsPost
        }

        return response

    },


    async createPosts(createPost: WithId<PostType>): Promise<PostViewType> {


        const result = await postsCollection.insertOne(createPost)

        return {
            id: result.insertedId.toString(),
            title: createPost.title,
            shortDescription: createPost.shortDescription,
            content: createPost.content,
            blogId: createPost.blogId,
            blogName: createPost.blogName,
            createdAt: createPost.createdAt
        }

    },


    async findIdPosts(id: string): Promise<PostViewType | null> {

        const findGetId: WithId<PostType> | null = await postsCollection.findOne({_id: new ObjectId(id)})

        if (findGetId) {
            return {
                id: findGetId._id.toString(),
                title: findGetId.title,
                shortDescription: findGetId.shortDescription,
                content: findGetId.content,
                blogId: findGetId.blogId,
                blogName: findGetId.blogName,
                createdAt: findGetId.createdAt

            }
        } else {
            return null
        }
    },


    async updatePosts(id: string, title: string, shortDescription: string,
                      content: string, blogId: string): Promise<boolean> {

        const result = await postsCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId
                }
            })
        return result.matchedCount === 1

    },

    async deletePosts(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1

    },

    async deletePostsAll(): Promise<boolean> {
        const result = await postsCollection.deleteMany({})
        return result.deletedCount === 1
    }

}



