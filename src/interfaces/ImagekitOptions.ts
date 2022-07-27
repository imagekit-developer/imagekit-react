import { TransformationPosition } from "./TransformationPosition";

export interface ImageKitOptions {
  urlEndpoint: string;
  sdkVersion?: string;
  publicKey?: string;
  authenticationEndpoint?: string;
  transformationPosition?: TransformationPosition;
}