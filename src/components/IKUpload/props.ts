type func = () => void

export default interface Props {
    fileName: string;
    tags: Array<any>;
    useUniqueFileName: boolean;
    responseFields: Array<any>;
    isPrivateFile: boolean,
    folder: string,
    customCoordinates: string,
    onError: func;
    onSuccess: func;
}