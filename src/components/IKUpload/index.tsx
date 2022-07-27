import React from 'react';
import ImageKit from 'imagekit-javascript';

import ImageKitComponent from "../ImageKitComponent";
import COMMON_PROPS from "../IKContext/props";
import IK_UPLOAD_PROPS from "./props";
import IKResponse from '../../interfaces/IKResponse';
import { UploadResponse } from '../../interfaces/ImgUploadResponse';

interface PROP_TYPES extends COMMON_PROPS, IK_UPLOAD_PROPS {
  useUniqueFileName: true,
  isPrivateFile: false,
  customCoordinates: "",
  tags: [],
  folder: "/",
  responseFields: []
};

export default class IKUpload extends ImageKitComponent {
  uploadFile(e: any) {
    const contextOptions = this.getContext();

    const {
      fileName,
      useUniqueFileName,
      tags,
      folder,
      isPrivateFile,
      customCoordinates,
      responseFields,
      onError,
      onSuccess
    }: any = this.props;

    const publicKey = this.props.publicKey || contextOptions.publicKey;
    const authenticationEndpoint = this.props.authenticationEndpoint || contextOptions.authenticationEndpoint;
    const urlEndpoint = this.props.urlEndpoint || contextOptions.urlEndpoint;

    if (!publicKey || publicKey.trim() === "") {
      if (onError && typeof onError === "function") {
        onError({
          message: "Missing publicKey"
        });
      }
      return;
    }

    if (!authenticationEndpoint || authenticationEndpoint.trim() === "") {
      if (onError && typeof onError === "function") {
        onError({
          message: "Missing authenticationEndpoint"
        });
      }
      return;
    }

    if (!urlEndpoint || urlEndpoint.trim() === "") {
      if (onError && typeof onError === "function") {
        onError({
          message: "Missing urlEndpoint"
        });
      }
      return;
    }

    var ikClient: ImageKit = this.getIKClient();

    const file = e.target.files[0];

    var params = {
      file: file,
      fileName: fileName || file.name,
      useUniqueFileName,
      tags,
      folder,
      isPrivateFile,
      customCoordinates,
      responseFields,
    }

    ikClient.upload(params, (err: Error | null, result: IKResponse<UploadResponse> | null) => {
      if (err) {
        if (onError && typeof onError === "function") {
          onError(err);
        }
      } else {
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      }
    }, {
      publicKey,
      authenticationEndpoint
    })
  }

  render() {
    let {
      publicKey,
      urlEndpoint,
      authenticationEndpoint,
      fileName,
      useUniqueFileName,
      tags,
      folder,
      isPrivateFile,
      customCoordinates,
      responseFields,
      onError,
      onSuccess,
      ...restProps
    }: any = this.props;

    return (
      <input
        type="file"
        {...restProps}
        onChange={(e) => {
          if (this.props.onChange && typeof this.props.onChange === "function") {
            this.props.onChange(e);
          }
          this.uploadFile(e);
        }}
      />
    )
  }
}