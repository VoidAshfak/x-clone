import prisma from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const { userId } = await auth()

    if (!userId) return;

    const userProfileId = searchParams.get("user")
    const page = searchParams.get("cursor")
    const LIMIT = 3

    const whereCondition = userProfileId !== "undefined"
        ? { userId: userProfileId as string, parentPostId: null }
        : {
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
            take: LIMIT,
            skip: (Number(page) - 1) * LIMIT
        }
    );

    const totalPosts = await prisma.post.count({
        where: whereCondition
    })

    const hasMore = Number(page) * LIMIT < totalPosts

    return Response.json({ posts, hasMore });
}