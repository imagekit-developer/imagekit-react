import { IKContextType } from '../IKContextType';

export type IKPropsType = IKContextType & {
    className?: string
    loading?: string,
    alt?: string,
    inputRef?: React.LegacyRef<HTMLInputElement>,
    width?: string,
    height?: string,
    controls?: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    enabledGif?: boolean,
    thumbnailTransformation?: any,
    onThumbnailLoad?: (thumbnail: string) => void,
    onUpload?: () => void
  }