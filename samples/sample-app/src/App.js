import React from 'react';
import './App.css';
import { IKImage, IKContext, IKUpload } from './src'
function App() {
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;
  const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;

  const authenticationEndpoint = process.env.REACT_APP_AUTHENTICATION_ENDPOINT;

  const path = "default-image.jpg";

  const src = `${urlEndpoint}/${path}`;

  const onError = err => {
    console.log("Error");
    console.log(err);
  };

  const onSuccess = res => {
    console.log("Success");
    console.log(res);
  };

  return (
    <div className="App">
      <h1>Hi! This is an ImageKit React SDK Demo!</h1>

      <p>Directly using <code>IkImage</code></p>
      <IKImage urlEndpoint={urlEndpoint} src={src} />

      <p>Using context <code>IKContext</code></p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <p>Let's add an Image</p>
        <IKImage src={src} />

        <p>Transformation - height and width manipulation</p>
        <IKImage src={src} transformation={[{
          "height": "200",
          "width": "200"
        }]} />

        <p>Chained transformation</p>
        <IKImage path={path} transformation={[{
          "height": "200",
          "width": "200",
        },
        {
          "rotation": "90"
        }]} />

        <p>Lazy loading image</p>
        <IKImage
          path={path}
          transformation={[{
            "height": "200",
            "width": "200"
          }]}
          loading="lazy"
        />

        <p>Progressive image loading wihtout lazy loading</p>
        <IKImage
          path="/custom.jpg"
          transformation={[{
            "height": "200",
            "width": "200"
          }]}
          onError={(e) => {
          }}
          lqip={{ active: true, quality: 20, blur: 10 }}
        />

        <p>Progressive image loading with lazy loading</p>
        <IKImage
          path={path}
          transformation={[{
            "height": "200",
            "width": "200"
          }]}
          loading="lazy"
          lqip={{ active: true, quality: 20, blur: 30 }}
        />


        <p>File upload - To use this funtionality please remember to setup the server</p>
        <IKUpload
          onError={onError}
          onSuccess={onSuccess}
        />

        <p>File upload along with upload API options - To use this funtionality please remember to setup the server</p>
        <IKUpload
          fileName="manu.jpg"
          tags={["sample-tag1", "sample-tag2"]}
          customCoordinates={"10,10,10,10"}
          isPrivateFile={false}
          useUniqueFileName={true}
          responseFields={["tags"]}
          folder={"/sample-folder"}
          onError={onError} onSuccess={onSuccess}
        />

      </IKContext>
    </div>
  );
}

export default App;

