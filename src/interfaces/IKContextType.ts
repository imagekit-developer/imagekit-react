import ImageKit from 'imagekit-javascript';

export interface IKContextType {
    publicKey?: string;
    urlEndpoint?: string;
    authenticationEndpoint?: string;
    lqip?: any;
    path?: string;
    src?: string;
    queryParameters?: { [key: string]: string | number },
    transformation?: any;
    transformationPosition?: any;
    fileName?: string;
    tags?: Array<string>;
    useUniqueFileName?: boolean;
    responseFields?: any;
    isPrivateFile?: boolean;
    folder?: string;
    customCoordinates?: string;
    onError?: (res: any) => void;
    onSuccess?: (res: any) => void;
    ikClient?: ImageKit;
}