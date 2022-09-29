import React from 'react';
import ImageKitComponent from "../ImageKitComponent";
import COMMON_PROPS from "../IKContext/props"
import IK_UPLOAD_PROPS, { IKUploadProps } from "./props"

const PROP_TYPES = {
  ...COMMON_PROPS,
  ...IK_UPLOAD_PROPS
};
type IKUploadState = {
  xhr?: XMLHttpRequest;
}

class IKUpload extends ImageKitComponent<IKUploadProps> {
  state: IKUploadState = {};
  static propTypes = PROP_TYPES;
  static defaultProps = {
    useUniqueFileName: true,
    isPrivateFile: false,
    customCoordinates: "",
    tags: [],
    folder: "/",
    responseFields: []
  };

  abort() {
    if (this.state.xhr) {
      this.state.xhr.abort();
    }
  }
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
      extensions,
      webhookUrl,
      overwriteFile,
      overwriteAITags,
      overwriteTags,
      overwriteCustomMetadata,
      customMetadata,
      onError,
      onSuccess,
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

    var ikClient = this.getIKClient();

    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (this.props.validateFile && !this.props.validateFile(file)) {
      return;
    }
    if (this.props.onUploadStart && typeof this.props.onUploadStart === "function") {
      this.props.onUploadStart(e);
    }

    const xhr = new XMLHttpRequest();
    const progressCb = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
      if (this.props.onUploadProgress && typeof this.props.onUploadProgress === 'function') {
        this.props.onUploadProgress(e);
      }
    };

    xhr.upload.addEventListener('progress', progressCb);

    var params = {
      file: file,
      fileName: fileName || file.name,
      useUniqueFileName,
      tags,
      folder,
      isPrivateFile,
      customCoordinates,
      responseFields,
      extensions,
      webhookUrl,
      overwriteFile,
      overwriteAITags,
      overwriteTags,
      overwriteCustomMetadata,
      customMetadata,
      xhr,
    }

    ikClient.upload(params, (err: any, result: any) => {
      if (err) {
        if (onError && typeof onError === "function") {
          onError(err);
        }
      } else {
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      }
      xhr.upload.removeEventListener('progress', progressCb);
    }, {
      publicKey,
      authenticationEndpoint
    });
    this.setState({ xhr });
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
      onUploadStart,
      onUploadProgress,
      inputRef,
      validateFile,
      ...restProps
    } = this.props;

    return (
      <input
        {...restProps}
        ref={inputRef}
        type="file"
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

export default IKUpload;
