import React from "react"
import IKImage from "../../components/IKImage";
import { storiesOf } from "@storybook/react";
import ErrorBoundary from "../../components/ErrorBoundary"

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
let urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
let path = "default-image.jpg";
const src= `${urlEndpoint}/${path}`;

const srcWithQuery = `${src}?foo=bar`

global.IntersectionObserver = class IntersectionObserver {
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
};

storiesOf("Image", module)
  .add(
    "imageWithSrc",
    () =>
    <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src={src} alt="abc"/>
  )
  .add(
    "imageWithPath",
    () =>
    <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path={path}/>
  )
  .add(
    "imageWithQueryParameters",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path={path} queryParameters={{version:5, name: 'check'}} />
  )
  .add(
    "imageWithSrcQueryParameters",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src={srcWithQuery} queryParameters={{version:5, name: 'check'}} />
  )
  .add(
    "leadingSlashesInPath",
    () =>
    <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path="////default-image.jpg"/>
  )
  .add(
    "trailingSlashesInUrlEndpoint",
    () =>
    <IKImage publicKey={publicKey} urlEndpoint="https://ik.imagekit.io/mindship////" path={path}/>
  )
  .add(
    "imageWithLQIP",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} lqip={{active:true, quality: 20}} src={src} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip"/>
  )
  .add(
    "imageWithTransformations",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src={src} transformation={[{
        height: 300,
        width: 400
      }]} />
  )
  .add(
    "imageLinkFail",
    () =>
      <ErrorBoundary>
        <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>

  )
  .add(
    "imagePublicKeyFail",
    () =>
      <ErrorBoundary>
        <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
          "heigth": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>

  )
  .add(
    "imageUrlEndpointFail",
    () =>
      <ErrorBoundary>
        <IKImage publicKey="public_oeVQ1TDolFID06vH0h6yMUeqjLY=" path={path} transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>

  );;

export default {
  title: 'Image',
};
