import React from 'react';
import ImageKitComponent from "../ImageKitComponent/ImageKitComponent";
import extractImageKitProps from '../../util/extractImageKitProps';

export default class IKUpload extends ImageKitComponent {

  onChangeHandler = (customOnChangeHandler, e, fileName, useUniqueFileName, tags, folder, isPrivateFile, customCoordinates, responseFields, extendedProps,  onError, onSuccess) => {
    if (customOnChangeHandler) {
      customOnChangeHandler(e);
      return;
    }

    this.upload(e.target.files[0], fileName, useUniqueFileName, tags, folder, isPrivateFile, customCoordinates, responseFields, extendedProps, onError, onSuccess)
  }

  render() {
    const props = { ...this.props };
    const { nonImageKitProps } = extractImageKitProps(props);
    const context = this.getContext();
    let extendedProps = ImageKitComponent.normalizeOptions(context, props);
    let { fileName, useUniqueFileName, tags, folder, isPrivateFile, customCoordinates, responseFields, onError, onSuccess } = this.props;
    if(useUniqueFileName === true) useUniqueFileName = "true"
    if(useUniqueFileName === false) useUniqueFileName = "false"
    if(isPrivateFile === true) isPrivateFile = "true"
    if(isPrivateFile === false) isPrivateFile = "false"
    return (
      <input {...nonImageKitProps} type="file" onChange={(e) => this.onChangeHandler(props.onChange, e, fileName, useUniqueFileName || "true", tags, folder || "/", isPrivateFile || "false", customCoordinates || "", responseFields || "", extendedProps,  onError, onSuccess)} />
    )

  }
}
