import React from 'react';
import ImageKit from 'imagekit-javascript';
import { ImageKitComponent } from "../ImageKit";

import IKResponse from '../../interfaces/IKResponse';
import { UploadResponse } from '../../interfaces/ImgUploadResponse';
import { ImageKitContext } from "../IKContext";

export class IKImgUpload extends ImageKitComponent {
  uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
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
    } = this.props;

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

    const ikClient: ImageKit = this.getIKClient();

    if (e.target.files?.length) {
      const file = e.target.files[0];
  
      const params = {
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
      innerRef,
      ...restProps
    } = this.props;

    return (
      <input
        ref={innerRef}
        type="file"
        {...restProps}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (this.props.onChange && typeof this.props.onChange === "function") {
            this.props.onChange(e);
          }
          this.uploadFile(e);
        }}
      />
    )
  }
}

IKImgUpload.contextType = ImageKitContext;