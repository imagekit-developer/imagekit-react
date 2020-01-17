import React from "react"
import IKImage from "../../components/IKImage";
import { storiesOf } from "@storybook/react";
import IKContext from "../../components/IKContext/IKContext";
import ErrorBoundary from "../../components/ErrorBoundary";

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
const path = "default-image.jpg";

storiesOf("IKContext", module)
  .add(
    "imageKitContext",
    () =>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path={path} transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </IKContext>
  )
  .add(
    "imagePublicKeyFail",
    () =>
      <ErrorBoundary>
        <IKContext urlEndpoint={urlEndpoint} >
          <IKImage path={path} transformation={[{
            "height": "300",
            "width": "400"
          }]} />
        </IKContext>
      </ErrorBoundary>
  );

export default {
  title: 'ImageKit Context',
};
