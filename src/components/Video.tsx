"use client";
import { Video as IKVideo } from "@imagekit/next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

type VideoTypes = {
    path: string;
    className?: string;
};

const Video = ({ path, className }: VideoTypes) => {
    return (
        <IKVideo
            urlEndpoint={urlEndpoint}
            src={path}
            className={className}
            transformation={[
                { width: 1920, height: 1080, quality: 90 },
            ]}
            controls
        />
    );
};

export default Video;