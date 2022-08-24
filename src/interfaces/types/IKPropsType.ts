import ImageKit from 'imagekit-javascript';

export type IKPropsType = {
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
  //end
  className?: string
  loading?: string,
  alt?: string,
  inputRef?: React.LegacyRef<HTMLInputElement>,
  width?: string,
  height?: string,
  controls?: boolean,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onStart?: (file: File, xhr: XMLHttpRequest) => void,
  xhr?: XMLHttpRequest
}