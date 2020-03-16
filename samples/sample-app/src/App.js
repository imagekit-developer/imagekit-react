import React from 'react';
import './App.css';
import { IKImage, IKContext, IKUpload } from 'imagekitio-react'
function App() {
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;
  let urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
  if(urlEndpoint[urlEndpoint.length-1] === "/")
    urlEndpoint = urlEndpoint.slice(0,urlEndpoint.length-1);

  const authenticationEndpoint = process.env.REACT_APP_AUTHENTICATION_ENDPOINT;

  let path = "/default-image.jpg";
  if(path[0] === "/")
    path = path.split("/")[1];

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
      <p>Let's add an Image</p>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src={src} />
      <p>Let's transform this once</p>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src={src} transformation={[{
        "height": "200",
        "width": "200"
      }]} />
      <p>Let's transform this more than once</p>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path={path} transformation={[{
        "height": "200",
        "width": "200",
      },
      {
        "rotation": "90"
      }]} />
      <p>Adding a Image with Context</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path={path} transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </IKContext>
      <p>LQIP</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path={path} queryParameters={{param1:"value1"}} lqip={{ active: true, quality: 30 }} />
      </IKContext>
      <p>Upload</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload
         fileName="sample-file.jpg" 
         tags={["sample-tag1","sample-tag2"]} 
         customCoordinates={"10,10,10,10"} 
         isPrivateFile={false}
         useUniqueFileName={true}
         folder={"/sample-folder"}
         onError={onError} onSuccess={onSuccess}
        />
      </IKContext>
      <p>To use this funtionality please remember to setup the server</p>
    </div>
  );
}

export default App;

