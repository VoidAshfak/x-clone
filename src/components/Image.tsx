
import { Image as IKImage } from "@imagekit/next"

type ImageType = {
    path: string;
    w?: number;
    h?: number;
    alt: string;
    className?: string;
    tr?: boolean;
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

if (!urlEndpoint) {
    throw new Error('Error: Please add urlEndpoint to .env or .env.local')
}

const Image = ({ path, w, h, alt, className, tr }: ImageType) => {
    return (
        <IKImage
            width={w}
            height={h}
            urlEndpoint={urlEndpoint}
            src={path}
            alt={alt}
            {...(tr ? { transformation: [{ width: `${w}`, height: `${h}` }] } : {})}
            className={className}
        />
    );
};

export default Image;
