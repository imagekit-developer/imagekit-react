import React from 'react';
import ImageKit from 'imagekit-javascript';

import ImageKitComponent from "../ImageKitComponent";
import CommonProps from "../IKContext/props";
import IKUploadProps from "./props";
import IKResponse from '../../interfaces/IKResponse';
import { UploadResponse } from '../../interfaces/ImgUploadResponse';

interface IProps extends CommonProps, IKUploadProps {
  onUploadStart?: (isStart: boolean) => void
};

class IKUpload extends ImageKitComponent {
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
      onSuccess,
      onUploadStart
    }: any = this.props;

    onUploadStart(true);

    const publicKey = this.props.publicKey || contextOptions.publicKey;
    const authenticationEndpoint = this.props.authenticationEndpoint || contextOptions.authenticationEndpoint;
    const urlEndpoint = this.props.urlEndpoint || contextOptions.urlEndpoint;

    if (!publicKey || publicKey.trim() === "") {
      if (onError && typeof onError === "function") {
        onUploadStart(false);
        onError({
          message: "Missing publicKey"
        });
      }
      return;
    }

    if (!authenticationEndpoint || authenticationEndpoint.trim() === "") {
      if (onError && typeof onError === "function") {
        onUploadStart(false);
        onError({
          message: "Missing authenticationEndpoint"
        });
      }
      return;
    }

    if (!urlEndpoint || urlEndpoint.trim() === "") {
      if (onError && typeof onError === "function") {
        onUploadStart(false);
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
          onUploadStart(false);
          onError(err);
        }
      } else {
        if (onSuccess && typeof onSuccess === "function") {
          onUploadStart(false);
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
      innerRef,
      ...restProps
    }: any = this.props;

    return (
      <input
        ref={innerRef}
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

export default React.forwardRef((props, ref) => <IKUpload innerRef={ref} {...props} />);