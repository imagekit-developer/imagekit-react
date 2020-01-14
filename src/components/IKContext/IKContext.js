import React from 'react';
import PropTypes from 'prop-types';
import ImageKitComponent from "../ImageKitComponent/ImageKitComponent";
import { ImageKitContextType } from './ImageKitContextType';
import extractImageKitProps from '../../util/extractImageKitProps';

/**
 * Provides a container for ImageKit components. Any option set in IKContext will be passed to the children.
 *
 * @example
 *<IKContext  publicKey="<public key>" urlEndpoint="url link">
 *    <!-- other tags -->
 *    <Image src={link}/>
 *</IKContext>
 */
class IKContext extends ImageKitComponent {
  render() {
    const props = { ...this.getContext(), ...this.props };

    const { children, imageKitProps, nonImageKitProps, imageKitReactProps } = extractImageKitProps(props);

    return (
      <ImageKitContextType.Provider value={imageKitProps}>
        {imageKitReactProps.includeOwnBody ? children : <div {...nonImageKitProps}>{children}</div>}
      </ImageKitContextType.Provider>
    )
  }
}

IKContext.propTypes = { ...ImageKitComponent.PropTypes, urlEndpoint: PropTypes.string, publicKey: PropTypes.string, includeOwnBody: PropTypes.bool };
IKContext.defaultProps = { includeOwnBody: false };
IKContext.contextType = ImageKitContextType;

export default IKContext;
