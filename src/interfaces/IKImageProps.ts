import { TransformationPosition } from './TransformationPosition';

export type LoadingType = "lazy"

export default interface IKImageProps {
    loading: LoadingType,
    lqip: any,
    path: string,
    src: string,
    queryParameters: any,
    transformation: Array<any>;
    transformationPosition: TransformationPosition;
}