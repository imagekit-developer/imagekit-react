import { TransformationPosition } from '../../interfaces/TransformationPosition';

export type LoadingType = "lazy"

export default interface Props {
    loading: LoadingType,
    lqip: any,
    path: string,
    src: string,
    queryParameters: any,
    transformation: Array<any>;
    transformationPosition: TransformationPosition;
}