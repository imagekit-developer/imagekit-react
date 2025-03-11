import React, { useContext, useEffect, useRef, useState } from 'react';
import { IKContextBaseProps, IKContextExtractedProps } from "../IKContext/props";
import COMBINED_PROP_TYPES, { IKVideoProps } from './combinedProps';
import { getSrc } from '../../utils/Utility';
import useImageKitComponent from '../ImageKitComponent';
import { ImageKitContext } from '../IKContext';

export type IKVideoState = {
  currentUrl?: string;
  contextOptions: IKContextExtractedProps;
};

const IKVideo = (props: IKVideoProps & IKContextBaseProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<IKVideoState>({
    currentUrl: undefined,
    contextOptions: {}
  });

  const { getIKClient } = useImageKitComponent({ ...props });
  const contextItems = useContext(ImageKitContext)

  useEffect(() => {
    const { originalSrc } = getSrc(props, getIKClient(), contextItems);
    setState((prevState) => ({ ...prevState, currentUrl: originalSrc, contextOptions: contextItems }));
  }, [contextItems, props]);

  const { currentUrl } = state;

  const { urlEndpoint, publicKey, authenticator, path, src, transformation, transformationPosition, queryParameters, ...restProps } = props;

  return (
    <video {...restProps} ref={videoRef} key={currentUrl}>
      <source src={currentUrl} type="video/mp4" />
    </video>
  );
}

IKVideo.propTypes = COMBINED_PROP_TYPES;

export default IKVideo;