import React from "react"
import IKImage from "../../components/IKImage";
import { storiesOf } from "@storybook/react";
import ErrorBoundary from "../../components/ErrorBoundary"

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
let urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
if(urlEndpoint[urlEndpoint.length-1] === "/")
  urlEndpoint = urlEndpoint.slice(0,urlEndpoint.length-1);

let path = "/default-image.jpg";
if(path[0] === "/")
  path = path.split("/")[1];

const src = `${urlEndpoint}${path}`;

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
};

storiesOf("Image", module)
  .add(
    "image",
    () =>
    <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src={src}/>
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
