import ImageKit from "imagekit";

export const imagekit = new ImageKit({
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT as string,
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    privateKey: process.env.PRIVATE_KEY as string,
});
