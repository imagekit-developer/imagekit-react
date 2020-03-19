# ImageKit.io React SDK

[![Node CI](https://github.com/imagekit-developer/imagekit-react/workflows/Node%20CI/badge.svg)](https://github.com/imagekit-developer/imagekit-react/)
[![npm version](https://img.shields.io/npm/v/imagekitio-react)](https://www.npmjs.com/package/imagekitio-react) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

React SDK for [ImageKit.io](https://imagekit.io), which implements client-side upload and URL generation for use inside a react application.

ImageKit is a complete image optimization and transformation solution that comes with an [image CDN](https://imagekit.io/features/imagekit-infrastructure) and media storage. It can be integrated with your existing infrastructure - storages like AWS S3, web servers, your CDN, and custom domain names, allowing you to deliver optimized images in minutes with minimal code changes.

## Installation

  `npm install --save imagekitio-react`

Include the components in your code:

  `import {IKContext} from "imagekitio-react"`

## Usage

The library includes 3 Components: 
* [IKContext](#IKContext)

* [IKImage - URL generation](#ikimage---url-generation)

* [IKUpload - File upload](#ikupload---file-upload)

### IKContext

In order to use the SDK, you need to provide it with a few configuration parameters. The configuration parameters can be applied directly to the `IKImage` component or using an `IKContext` component. example:

```js
<IKContext
  publicKey="your_public_api_key"
  urlEndpoint="<https://ik.imagekit.io/your_imagekit_id>"
  transformationPosition="path"
  authenticationEndpoint="<http://www.yourserver.com/auth">
</IKContext>
```

`publicKey` and `urlEndpoint` are mandatory parameters for SDK initialization.
`authenticationEndpoint` is essential if you want to use the SDK for client-side uploads.
`transformationPosition` is optional. The default value for this parameter is `path`. Acceptable values are `path` & `query`

_Note: Do not include your Private Key in any client-side code, including this SDK or its initialization. If you pass the `privateKey` parameter while initializing this SDK, it throws an error_

### IKImage - URL generation

The IKImage component component defines an ImageKit Image tag. example usage:

#### Using image path and image hostname or endpoint

```js
<IKContext publicKey="your_public_api_key" urlEndpoint="https://ik.imagekit.io/your_imagekit_id/endpoint/" >
  <IKImage path="/default-image.jpg" transformation={[{
    "height": "300",
    "width": "400"
  }]} />
</IKContext>
```
#### Using full image URL  

```js
<IKImage 
    src="<full_image_url_from_db>" 
    transformation={[{
    "height": "300",
    "width": "400"
  }]}
/>
```
  
#### Supported props:

| Option           | Description                    |
| :----------------| :----------------------------- |
| urlEndpoint      | Optional. The base URL to be appended before the path of the image. If not specified, the URL Endpoint specified at the time of SDK initialization is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| path             | Conditional. This is the path at which the image exists. For example, `/path/to/image.jpg`. Either the `path` or `src` parameter need to be specified for URL generation. |
| src              | Conditional. This is the complete URL of an image already mapped to ImageKit. For example, `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/image.jpg`. Either the `path` or `src` parameter need to be specified for URL generation. |
| transformation   | Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name  and the value should be specified as a key-value pair in the object. Different steps of a [chained transformation](https://docs.imagekit.io/features/image-transformations/chained-transformations) can be specified as different objects of the array. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it gets applied as it is in the URL. |
| transformationPostion | Optional. The default value is `path` that places the transformation string as a path parameter in the URL. It can also be specified as `query` which adds the transformation string as the query parameter `tr` in the URL. If you use `src` parameter to create the URL, then the transformation string is always added as a query parameter. |
| queryParameters  | Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and not necessarily related to ImageKit. Especially useful if you want to add some versioning parameter to your URLs. |

#### List of supported transformations

The complete list of transformations supported and their usage in ImageKit can be found [here](https://docs.imagekit.io/features/image-transformations). The SDK gives a name to each transformation parameter, making the code simpler and readable. If a transformation is supported in ImageKit, but a name for it cannot be found in the table below, then use the transformation code from ImageKit docs as the name when using in the `url` function.

| Supported Transformation Name | Translates to parameter |
| ----------------------------- | ----------------------- |
| height                        | h                       |
| width                         | w                       |
| aspectRatio                   | ar                      |
| quality                       | q                       |
| crop                          | c                       |
| cropMode                      | cm                      |
| x                             | x                       |
| y                             | y                       |
| focus                         | fo                      |
| format                        | f                       |
| radius                        | r                       |
| background                    | bg                      |
| border                        | bo                      |
| rotation                      | rt                      |
| blur                          | bl                      |
| named                         | n                       |
| overlayImage                  | oi                      |
| overlayX                      | ox                      |
| overlayY                      | oy                      |
| overlayFocus                  | ofo                     |
| overlayHeight                 | oh                      |
| overlayWidth                  | ow                      |
| overlayText                   | ot                      |
| overlayTextFontSize           | ots                     |
| overlayTextFontFamily         | otf                     |
| overlayTextColor              | otc                     |
| overlayAlpha                  | oa                      |
| overlayTextTypography         | ott                     |
| overlayBackground             | obg                     |
| overlayImageTrim              | oit                     |
| progressive                   | pr                      |
| lossless                      | lo                      |
| trim                          | t                       |
| metadata                      | md                      |
| colorProfile                  | cp                      |
| defaultImage                  | di                      |
| dpr                           | dpr                     |
| effectSharpen                 | e-sharpen               |
| effectUSM                     | e-usm                   |
| effectContrast                | e-contrast              |
| effectGray                    | e-grayscale             |
| original                      | orig                    |

#### Applying Transforms
```js
const transformations = [{
  width: 90,
  height: 180
}]

<IKImage style="" src="<full_image_url_from_db>" transformations = {transformations}/>
```
The above image will apply transformation of width = 90 and height = 180 on the image. Since some transformatinos are destructive you might want to control the order in which the transforms are applied.

##### Chained Transforms
Chained transforms make it easy to specify the order in which transformations are applied. example: 

```js
const transformations = [
  {
    rotate: 90
  },
  {
    width: 100,
    aspectRatio: "16-9"
  }
];
```
In the above case, the rotation will be performed first, and resizing according to width and aspect ratio will be performed afterward.

#### Low Quality Image Placeholders (LQIP) for images
The SDK supports automatic support for LQIP for your images, if you set lqip to true in the image component. example:

  ```js 
  <IKImage style="" src="<full_image_url_from_db>" lqip={{active:true, quality: 20}}/>
  ```
`active` tells the status for lqip, it can be either, `true` or `false`
`quality` decided the quaility of placeholder image. It can be any numeric value, a low number means low quality, and high number means high quality.

##### How does the lqip work?
The component tries to keep it simple. It loads a lower quality image using the quality parameter to load a lower quality image, which is then replaced with the actual quality image later.

### IKUpload - File Upload
The SDK provides a simple Component to upload files to the ImageKit Media Library. It accepts `fileName` parameter as a prop. The file parameter is provided as an input from the user. 

Also, make sure that you have specified `authenticationEndpoint` during SDK initialization. The SDK makes an HTTP GET request to this endpoint and expects a JSON response with three fields i.e. `signature`, `token` and `expire`.  

[Learn how to implement authenticationEndpoint](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#how-to-implement-authenticationendpoint-endpoint) on your server.

An example of this server is provided in the samples folder of the SDK.

Sample Usage
```js
<IKContext
  publicKey="your_public_api_key" 
  urlEndpoint="<https://ik.imagekit.io/your_imagekit_id>" 
  authenticationEndpoint="<http://www.yourserver.com/auth">
  <IKUpload fileName="my-upload" />
</IKContext>
```

`IKUpload` component accepts all the parameters supported by the [ImageKit Upload API](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#request-structure-multipart-form-data) as props e.g. `tags`, `useUniqueFileName`, `folder` etc.

You can use `onSuccess` and `onError` callbacks to handle success and failure, respectively. You can pass your custom functions to handle the response from API.

```js
const onError = err => {
  console.log("Error");
  console.log(err);
};

const onSuccess = res => {
  console.log("Success");
  console.log(res);
};

<IKContext 
  publicKey="your_public_api_key" 
  urlEndpoint="<https://ik.imagekit.io/your_imagekit_id>" 
  authenticationEndpoint="<http://www.yourserver.com/auth">
  <IKUpload fileName="custom_file_name" onError={onError} onSuccess={onSuccess} />
</IKContext>
```
## Demo Application
The fastest way to get started is by running the demo application. You can run the code locally. The source code is in samples/sample-app. For the instructions in [readme.md](https://github.com/imagekit-developer/imagekit-react/blob/master/samples/sample-app/README.md) file within [samples/sample-app](https://github.com/imagekit-developer/imagekit-react/tree/master/samples/sample-app) folder.

## Error Handling
We are using Error Boundaries to handle errors in the UI. `ErrorBoundary` is used to handle errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. example: 

```js
 <ErrorBoundary>
  <IKImage publicKey="public_oeVQ1TDolFID06vH0h6yMUeqjLY=" urlEndpoint="https://ik.imagekit.io/gqyojxcwzxj/" transformation={[{
    "height": "300",
    "width": "400"
  }]} />
</ErrorBoundary>
```

## Support

For any feedback or to report any issues or general implementation support please reach out to [support@imagekit.io](mailto:support@imagekit.io)

## Links
* [Documentation](https://docs.imagekit.io)
* [Main website](https://imagekit.io)

## License

Released under the MIT license.