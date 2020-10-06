
const IMAGEKIT_REACT_PROPS = {includeOwnBody : true, src:true, transformation:true, queryParameters: true};

const IMAGEKIT_PROPS = {
  publicKey: true,
  urlEndpoint: true,
  authenticationEndpoint: true,
  lqip: true,
  onError: true,
  onSuccess: true,
  fileName: true,
  tags: true,
  useUniqueFileName: true,
  responseFields: true,
  isPrivateFile: true,
  folder: true,
  customCoordinates: true,
  loading: true,
  path: true
};

const isDefined = (props, key) => {
  return (props[key] !== undefined && props[key] !== null);
};

export default ({children, ...props}) => {

  let result = {
    children,
    imageKitProps: {},
    nonImageKitProps: {},
    imageKitReactProps: {}
  };

  Object.keys(props).forEach(key => {
    const value = props[key];
    if(IMAGEKIT_PROPS[key]) {
      if(isDefined(props, key)) {
        result.imageKitProps[key] = value;
      }
    }
    else if(IMAGEKIT_REACT_PROPS[key]) {
      result.imageKitReactProps[key] = value;
    }
    else {
      result.nonImageKitProps[key] = value;
    }
  });

  return result;
};
