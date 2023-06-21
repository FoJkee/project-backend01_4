
export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogViewType = BlogType & { id: string }


export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type PostViewType = PostType & {id: string}



export type PaginatedType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number
    totalCount: number,
    items: T[]

}



