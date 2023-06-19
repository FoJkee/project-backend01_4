import {postsCollection} from "../setting/db";


function skipped(pageNumber: number, pageSize: number) {
    return (Number(pageNumber - 1) * Number(pageSize))
}

function sort(sortDirection: string) {

    return (sortDirection === 'desc') ? -1 : 1
}


export const queryRepositoryBlog = {

    async findPost(searchNameTerm: string, sortBy: string,
                   sortDirection: string, pageNumber: number, pageSize: number) {

        const postCount = await postsCollection.countDocuments({})

        const post = await postsCollection.find({})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(Number(pageSize))
            .toArray()

        const postOut = post.map(el => ({

            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt

        }))


        const pageCount = Math.ceil(Number(postCount) / Number(pageSize))

            }









}









