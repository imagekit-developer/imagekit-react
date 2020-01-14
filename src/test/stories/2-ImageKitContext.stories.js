import React from "react"
import IKImage from "../../components/IKImage";
import { storiesOf } from "@storybook/react";
import IKContext from "../../components/IKContext/IKContext";
import ErrorBoundary from "../../components/ErrorBoundary";

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;

storiesOf("IKContext", module)
  .add(
    "imageKitContext",
    () =>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path="/ABC_BV8lzpfOS" transformation={[{
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
          <IKImage path="/ABC_BV8lzpfOS" transformation={[{
            "height": "300",
            "width": "400"
          }]} />
        </IKContext>
      </ErrorBoundary>
  );

export default {
  title: 'ImageKit Context',
};
