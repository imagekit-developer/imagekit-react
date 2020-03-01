import React from "react"
import IKImage from "../../components/IKImage";
import { storiesOf } from "@storybook/react";

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
const path = "/default-image.jpg";

storiesOf("Image-Transformation", module)
  .add(
    "imageWithSingleTransformations",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path={path} transformation={[{
        "height": "300",
        "width": "400"
      }]} />
  )
  .add(
    "imageWithChainedTransformations",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path={path} transformation={[{
        "height": "300",
        "width": "400"
      }, {
        "rotation": 90
      }]} />
  )
  .add(
    "imageWithNonExistingTransformation",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path={path} transformation={[{
        "foo": "bar",
      }]} />
  )
  .add(
    "imageWithNonExistingTransformationWithExistingTransformation",
    () =>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path={path} transformation={[{
        "foo": "bar",
        "height": "300"
      }]} />
  );;

export default {
  title: 'Image Transformation',
};
