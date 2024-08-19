import { Conservation } from "../app/api/conservation/conservation-type"
import { useLazyGetPreSignedUrlQuery } from "../app/api/file/file-api-slice"

export type MediaUploadProps = {
    conservation: Conservation,
} 

const sendFile = async (url: string, file: File) => {
    return (await fetch( url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file
    }));
}

export type PresignedUrl = {
    fileUploadedUrl: string,
    url: string,
}

export const useMediaUpload = () => {
    const [ getPreSignedUrl ] = useLazyGetPreSignedUrlQuery();

    return async (file: File) => {

        let preSignedUrl = ((await (getPreSignedUrl().unwrap())).data);
        console.log("preSignedURL" + preSignedUrl)

        const msg = await sendFile(preSignedUrl!.url, file)

        if(msg.ok) {
            return {
                url: preSignedUrl!.fileUploadedUrl
            };
        } else {
            throw new Error('Have some error when uploading your file');
        }

       
    }
}