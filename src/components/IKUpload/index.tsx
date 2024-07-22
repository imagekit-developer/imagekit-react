import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { IKContextBaseProps } from "../IKContext/props";
import { IKUploadProps, OverrideValues } from "./props";
import { ImageKitContext } from '../IKContext';
import useImageKitComponent from '../ImageKitComponent';

type IKUploadState = {
  xhr?: XMLHttpRequest;
};

const IKUpload = forwardRef<HTMLInputElement, IKUploadProps & IKContextBaseProps>((props, ref) => {
  const [state, setState] = useState<IKUploadState>({});
  const contextOptions = useContext(ImageKitContext);
  const { getIKClient } = useImageKitComponent({ ...props });


  useEffect(() => {
    const abort = () => {
      if (state.xhr) {
        state.xhr.abort();
      }
    };
    if (ref && typeof ref === "object" && ref.hasOwnProperty("current")) {
      const refObject = ref as any;
      refObject.current.abort = abort;
    }
  }, [state.xhr, ref]);

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
    transformation,
    checks,
    overrideParameters,
    ...restProps
  } = props;

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {

    const publicKey = props.publicKey || contextOptions.publicKey;
    const authenticator = props.authenticator || contextOptions.authenticator;
    const urlEndpoint = props.urlEndpoint || contextOptions.urlEndpoint;

    if (!publicKey || publicKey.trim() === "") {
      console.error("Missing publicKey");
      if (onError && typeof onError === "function") {
        onError({
          message: "Missing publicKey"
        });
      }
      return;
    }

    if (!authenticator) {
      console.error("The authenticator function is not provided.");
      if (onError && typeof onError === "function") {
        onError({
          message: "The authenticator function is not provided."
        });
      }
      return;
    }

    if (typeof authenticator !== 'function') {
      console.error("The provided authenticator is not a function.");
      if (onError && typeof onError === "function") {
        onError({
          message: "The provided authenticator is not a function."
        });
      }
      return;
    }

    if (!urlEndpoint || urlEndpoint.trim() === "") {
      console.error("Missing urlEndpoint");
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

    let overrideValues: OverrideValues = {};

    if (props.overrideParameters && typeof props.overrideParameters === 'function') {
      overrideValues = props.overrideParameters(file) || {};
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
      fileName: overrideValues.fileName || fileName || file.name,
      useUniqueFileName:  overrideValues.useUniqueFileName || useUniqueFileName,
      tags: overrideValues.tags || tags,
      folder: overrideValues.folder || folder,
      isPrivateFile: overrideValues.isPrivateFile || isPrivateFile,
      customCoordinates: overrideValues.customCoordinates || customCoordinates,
      responseFields,
      extensions: overrideValues.extensions || extensions,
      webhookUrl: overrideValues.webhookUrl || webhookUrl,
      overwriteFile: overrideValues.overwriteFile || overwriteFile,
      overwriteAITags: overrideValues.overwriteAITags || overwriteAITags,
      overwriteTags: overrideValues.overwriteTags || overwriteTags,
      overwriteCustomMetadata: overrideValues.overwriteCustomMetadata || overwriteCustomMetadata,
      customMetadata: overrideValues.customMetadata || customMetadata,
      signature: '',
      expire: 0,
      token: '',
      xhr,
      transformation: overrideValues.transformation || transformation,
      checks: overrideValues.checks || checks
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

export default IKUpload;