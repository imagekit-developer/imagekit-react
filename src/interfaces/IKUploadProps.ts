import { UploadResponse } from './ImgUploadResponse';
import IKResponse from './IKResponse';

type func = () => void

export default interface IKUploadProps {
    fileName: string;
    tags: Array<any>;
    useUniqueFileName: boolean;
    responseFields: Array<any>;
    isPrivateFile: boolean,
    folder: string,
    customCoordinates: string,
    onError: (error: Error | null) => void;
    onSuccess: (response: IKResponse<UploadResponse> | null) => void;
}