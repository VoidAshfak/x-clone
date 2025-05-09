"use client"

import { useInfiniteQuery } from "@tanstack/react-query"


const fetchPosts = async (pageParam: number, userProfileId?: string) => {
    const res = await fetch("/api/posts?cursor=" + pageParam + "&user=" + userProfileId)
    return res.json()
}


const InfiniteFeed = ({userProfileId}: {userProfileId?: string}) => {

    const {data, error, status, hasNextPage, fetchNextPage} = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: ({pageParam = 2}) => fetchPosts(pageParam, userProfileId),
        initialPageParam: 2,
        getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 2 : undefined
    })
    
    if(error) return <div>Something went wrong</div>
    if(status === "pending") return <div>Loading...</div>

    console.log("PAGE DATA: ",data);
    

    return (
        <div>
            infinite feed
        </div>
    )
}

export default InfiniteFeed