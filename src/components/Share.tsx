"use client";

import React, { useState, useRef } from 'react'
import Image from './Image'
import NextImage from 'next/image';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import ImageEdior from './ImageEdior'

// Create an AbortController instance to provide an option to cancel the upload if needed.
const abortController = new AbortController();

const handleUpload = async (file: any, authParams: any) => {

    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
        const uploadResponse = await upload({
            // Authentication parameters
            expire,
            token,
            signature,
            publicKey,
            file,
            fileName: file.name, // Optionally set a custom file name
            folder: "/general", // Optionally set a custom folder
            transformation: {
                pre: "w-600,quality-10",
            },
            // Progress callback to update upload progress state
            // onProgress: (event) => {
            //     setProgress((event.loaded / event.total) * 100);
            // },
            // Abort signal to allow cancellation of the upload if needed.
            abortSignal: abortController.signal,
        });
        console.log("Upload response:", uploadResponse);
    } catch (error) {
        // Handle specific error types provided by the ImageKit SDK.
        if (error instanceof ImageKitAbortError) {
            console.error("Upload aborted:", error.reason);
        } else if (error instanceof ImageKitInvalidRequestError) {
            console.error("Invalid request:", error.message);
        } else if (error instanceof ImageKitUploadNetworkError) {
            console.error("Network error:", error.message);
        } else if (error instanceof ImageKitServerError) {
            console.error("Server error:", error.message);
        } else {
            // Handle any other errors that may occur.
            console.error("Upload error:", error);
        }
    }
};

const authenticator = async () => {
    try {
        // Perform the request to the upload authentication endpoint.
        const response = await fetch("/api/upload-auth");
        if (!response.ok) {
            // If the server response is not successful, extract the error text for debugging.
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        // Parse and destructure the response JSON for upload credentials.
        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        // Log the original error for debugging before rethrowing a new error.
        console.error("ImageKit Authentication error:", error);
        throw new Error(" ImageKit Authentication request failed");
    }
};


const Share = () => {
    const [media, setMedia] = useState<File | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [settings, setSettings] = useState<{
        type: "original" | "wide" | "square";
        sensitive: boolean;
    }>({
        type: "original",
        sensitive: false,
    });

    // Create a ref for the file input element to access its files easily
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFormSubmit = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files! || fileInput.files!.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }

        const file = fileInput.files![0]
        handleUpload(file, authParams);
    }


    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMedia(e.target.files[0]);
        }
    };


    const previewURL = media ? URL.createObjectURL(media) : null;

    return (
        <form action={handleFormSubmit} className='p-4 flex gap-4'>
            {/* AVATAR */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image path="/general/avatar.png" alt="avatar" w={100} h={100} tr={true} />
            </div>
            {/* OTHERS */}
            <div className="flex-1 flex flex-col gap-4">
                <input
                    type="text"
                    name="desc"
                    placeholder="What is happening?!"
                    className="bg-transparent outline-none placeholder:text-textGray text-xl"
                />
                {/* <progress value={progress} max={100}></progress> */}

                {/* PREVIEW IMAGE */}
                {
                    previewURL && <div className='relative rounded-xl overflow-hidden'>
                        <NextImage
                            src={previewURL}
                            alt='preview'
                            width={600}
                            height={600}
                        />
                        <div className="absolute top-2 left-2 bg-black/50 font-bold px-4 py-1 text-sm rounded-xl cursor-pointer hover:bg-black/70" onClick={() => setIsEditorOpen(true)}>Edit</div>
                    </div>
                }

                {
                    isEditorOpen && previewURL &&
                    <ImageEdior
                        onClose={() => setIsEditorOpen(false)}
                        previewURL={previewURL}
                        settings={settings}
                        setSettings={setSettings}
                    />
                }

                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-4 flex-wrap">
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="file"
                            onChange={handleMediaChange}
                            className="hidden"
                            id="file"
                            accept="image/*,video/*"
                        />
                        <label htmlFor="file">
                            <Image
                                path="icons/image.svg"
                                alt=""
                                w={20}
                                h={20}
                                className="cursor-pointer"
                            />
                        </label>
                        <Image
                            path="icons/gif.svg"
                            alt=""
                            w={20}
                            h={20}
                            className="cursor-pointer"
                        />
                        <Image
                            path="icons/poll.svg"
                            alt=""
                            w={20}
                            h={20}
                            className="cursor-pointer"
                        />
                        <Image
                            path="icons/emoji.svg"
                            alt=""
                            w={20}
                            h={20}
                            className="cursor-pointer"
                        />
                        <Image
                            path="icons/schedule.svg"
                            alt=""
                            w={20}
                            h={20}
                            className="cursor-pointer"
                        />
                        <Image
                            path="icons/location.svg"
                            alt=""
                            w={20}
                            h={20}
                            className="cursor-pointer"
                        />
                    </div>
                    <button className='bg-white text-black font-bold rounded-full py-2 px-4'>Post</button>
                </div>
            </div>
        </form>
    )
}

export default Share