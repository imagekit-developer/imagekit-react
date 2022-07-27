import { UploadResponse } from '../../interfaces/ImgUploadResponse';
import IKResponse from '../../interfaces/IKResponse';

type func = () => void

export default interface Props {
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