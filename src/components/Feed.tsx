import prisma from "@/prisma"
import Post from "./Post"
import InfiniteFeed from "./InfiniteFeed"
import { auth } from "@clerk/nextjs/server"

const Feed = async ({ userProfileId }: { userProfileId?: string }) => {

    const { userId } = await auth()

    if (!userId) return

    const whereCondition = userProfileId ? { userId: userProfileId, parentPostId: null } : {
        userId: {
            in: [
                userId,
                ...(
                    await prisma.follow.findMany({
                        where: { followerId: userId },
                        select: { followingId: true }
                    })
                ).map((follow) => follow.followingId)
            ]
        },
        parentPostId: null
    }

    const posts = await prisma.post.findMany(
        {
            where: whereCondition,
            take: 3,
            skip: 0,
            orderBy: { createdAt: 'desc' }
        }
    );
    
    return (
        <div className="">
            {posts.map((post) => (
                <div key={post.id}>
                    <Post />
                </div>
            ))}
            <InfiniteFeed userProfileId={userProfileId} />
        </div>
    )
}

export default Feed