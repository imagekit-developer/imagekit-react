import React, { forwardRef, useContext, useState } from 'react';
import COMMON_PROPS, { IKContextBaseProps } from "../IKContext/props";
import IK_UPLOAD_PROPS, { IKUploadProps } from "./props";
import { ImageKitContext } from '../IKContext';
import useImageKitComponent from '../ImageKitComponent';

const PROP_TYPES = {
  ...COMMON_PROPS,
  ...IK_UPLOAD_PROPS
};

type IKUploadState = {
  xhr?: XMLHttpRequest;
};

const IKUpload = forwardRef<HTMLInputElement, IKUploadProps & IKContextBaseProps>((props, ref) => {
  const [state, setState] = useState<IKUploadState>({});
  const contextOptions = useContext(ImageKitContext);
  const { getIKClient } = useImageKitComponent({ ...props });

  const abort = () => {
    if (state.xhr) {
      state.xhr.abort();
    }
  }

  if (ref && (ref as any).current) {
    (ref as any).current = { ...(ref as any).current, abort }
  }

  const {
    publicKey,
    urlEndpoint,
    authenticator,
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
    validateFile,
    webhookUrl,
    overwriteFile,
    overwriteAITags,
    overwriteTags,
    overwriteCustomMetadata,
    extensions,
    customMetadata,
    ...restProps
  } = props;

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {

    const publicKey = props.publicKey || contextOptions.publicKey;
    const authenticator = props.authenticator || contextOptions.authenticator;
    const urlEndpoint = props.urlEndpoint || contextOptions.urlEndpoint;

    if (!publicKey || publicKey.trim() === "") {
      if (onError && typeof onError === "function") {
        onError({
          message: "Missing publicKey"
        });
      }
      return;
    }

    if (!authenticator) {
      if (onError && typeof onError === "function") {
        onError({
          message: "The authenticator function is not provided."
        });
      }
      return;
    }

    if (typeof authenticator !== 'function') {
      if (onError && typeof onError === "function") {
        onError({
          message: "The provided authenticator is not a function."
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

    var ikClient = getIKClient();

    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (props.validateFile && !props.validateFile(file)) {
      return;
    }

    if (props.onUploadStart && typeof props.onUploadStart === "function") {
      props.onUploadStart(e);
    }

    const xhr = new XMLHttpRequest();
    const progressCb = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
      if (props.onUploadProgress && typeof props.onUploadProgress === 'function') {
        props.onUploadProgress(e);
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
      signature: '',
      expire: 0,
      token: '',
      xhr,
    };

    const authPromise = authenticator();

    if (!(authPromise instanceof Promise)) {
      if (onError && typeof onError === "function") {
        onError({
          message: "The authenticator function is expected to return a Promise instance."
        });
      }
      return;
    }

    authPromise
      .then(({ signature, token, expire }) => {
        params['signature'] = signature;
        params['expire'] = expire;
        params['token'] = token
        ikClient.upload(params, (err: any, result: any) => {
          if (err) {
            if (onError && typeof onError === "function") {
              console.log(err)
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
        });
        setState({ xhr })
      })
      .catch((data) => {
        var error;
        if (data instanceof Array) {
          error = data[0];
        }
        else {
          error = data
        }

        if (onError && typeof onError === "function") {
          onError({
            message: String(error)
          });
        }
        return;
      })
  };

  return (
    <input
      {...restProps}
      ref={ref}
      type="file"
      onChange={(e) => {
        if (props.onChange && typeof props.onChange === "function") {
          props.onChange(e);
        }
        uploadFile(e);
      }}
    />
  );
});

IKUpload.propTypes = { ...PROP_TYPES };

export default IKUpload;