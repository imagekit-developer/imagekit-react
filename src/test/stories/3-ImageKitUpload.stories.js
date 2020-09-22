import React from "react"
import { storiesOf } from "@storybook/react";
import IKContext from "../../components/IKContext/IKContext";
import IKUpload from "../../components/IKUpload/IKUpload";

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
const authenticationEndpoint = process.env.REACT_APP_AUTHENTICATION_ENDPOINT;

let onError = err => {
  console.log("Error");
};

let onSuccess = res => {
  console.log("Success");
};

storiesOf("IKUpload", module)
  .add(
    "imageKitUploadwithAuthentication",
    () =>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload fileName="ABC" onError={onError} onSuccess={onSuccess} />
      </IKContext>
  ).add(
    "imageKitUploadwithAllTheProps",
    () =>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload fileName="ABC" useUniqueFileName="false" tags={["tag1", "tag2"]} folder="/" isPrivateFile="true" customCoordinates="0,0,0,0" responseFields={["isPrivateFile", "customCoordinates"]} onError={onError} onSuccess={onSuccess} />
      </IKContext>
  )
  .add(
    "imageKitUploadWithoutFileName",
    () =>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload useUniqueFileName="true" onError={onError} onSuccess={onSuccess} />
      </IKContext>
  )
  .add(
    "imageKitUploadwithoutAuthentication",
    () =>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint}>
        <IKUpload fileName="ABC" />
      </IKContext>
  );

export default {
  title: 'ImageKit Upload',
};
