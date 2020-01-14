import React from "react"
import IKImage from "../../components/IKImage";
import { storiesOf } from "@storybook/react";
import ErrorBoundary from "../../components/ErrorBoundary"

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;

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
    <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src="https://ik.imagekit.io/gqyojxcwzxj/ABC_BV8lzpfOS"/>
  )
  .add(
    "imageWithLQIP",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} lqip={{active:true, quality: 20}} src="https://ik.imagekit.io/gqyojxcwzxj/ABC_BV8lzpfOS" transformation={[{
        height: 300,
        width: 400
      }]} id="lqip"/>
  )
  .add(
    "imageWithTransformations",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src="https://ik.imagekit.io/gqyojxcwzxj/ABC_BV8lzpfOS" transformation={[{
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
        <IKImage urlEndpoint={urlEndpoint} path="/ABC_BV8lzpfOS" transformation={[{
          "heigth": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>

  )
  .add(
    "imageUrlEndpointFail",
    () =>
      <ErrorBoundary>
        <IKImage publicKey="public_oeVQ1TDolFID06vH0h6yMUeqjLY=" path="/ABC_BV8lzpfOS" transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>

  );;

export default {
  title: 'Image',
};
