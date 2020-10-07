import React from "react"
import IKImage from "../../components/IKImage";
import { storiesOf } from "@storybook/react";
import ErrorBoundary from "../../components/ErrorBoundary"

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
let urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
let path = "default-image.jpg";
const src= `${urlEndpoint}/${path}`;
let nestedImagePath = "/sample-folder/default-image.jpg";

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
    <IKImage urlEndpoint={urlEndpoint} src={src} alt="abc"/>
  )
  .add(
    "imageWithPath",
    () =>
    <IKImage urlEndpoint={urlEndpoint} path={path}/>
  )
  .add(
    "imageWithQueryParameters",
    () =>
      <IKImage urlEndpoint={urlEndpoint} path={path} queryParameters={{version:5, name: 'check'}} />
  )
  .add(
    "imageWithSrcQueryParameters",
    () =>
      <IKImage urlEndpoint={urlEndpoint} src={srcWithQuery} queryParameters={{version:5, name: 'check'}} />
  )
  .add(
    "leadingSlashesInPath",
    () =>
    <IKImage urlEndpoint={urlEndpoint} path="////default-image.jpg"/>
  )
  .add(
    "trailingSlashesInUrlEndpoint",
    () =>
    <IKImage urlEndpoint="https://ik.imagekit.io/mindship////" path={path}/>
  )
  .add(
    "imageWithLQIPWithSrcNoTransformation",
    () =>
      <IKImage urlEndpoint={urlEndpoint} lqip={{active:true, quality: 20}} src={src} id="lqip"/>
  )
  .add(
    "imageWithLQIPWithSrcWithTransformation",
    () =>
      <IKImage urlEndpoint={urlEndpoint} lqip={{active:true, quality: 20}} src={src} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip"/>
  )
  .add(
    "imageWithLQIPWithPathNoTransformation",
    () =>
      <IKImage urlEndpoint={urlEndpoint} lqip={{active:true, quality: 20}} path={path} id="lqip"/>
  )
  .add(
    "imageWithLQIPWithPathWithTransformation",
    () =>
      <IKImage urlEndpoint={urlEndpoint} lqip={{active:true, quality: 20}} path={path} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip"/>
  )
  .add(
    "nestedImagePathWithLQIP",
    () =>
      <IKImage urlEndpoint={urlEndpoint} lqip={{active:true, quality: 50, blur: 25}} path={nestedImagePath} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip"/>
  )
  .add(
    "imageWithTransformations",
    () =>
      <IKImage urlEndpoint={urlEndpoint} src={src} transformation={[{
        height: 300,
        width: 400
      }]} />
  )
  .add(
    "missingUrlEndpointFail",
    () =>
      <ErrorBoundary>
        <IKImage transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>

  )
  .add(
    "imageUrlEndpointFail",
    () =>
      <ErrorBoundary>
        <IKImage path={path} transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>

  );;

export default {
  title: 'Image',
};
