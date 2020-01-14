import React from 'react';
import './App.css';
import { IKImage, IKContext, IKUpload } from 'imagekit-react'
function App() {
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;
  const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
  const authenticationEndpoint = process.env.REACT_APP_AUTHENTICATION_ENDPOINT;

  return (
    <div className="App">
      <h1>Hi! This is an ImageKit React SDK Demo!</h1>
      <p>Let's add an Image</p>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src="https://ik.imagekit.io/gqyojxcwzxj/ABC_BV8lzpfOS" />
      <p>Let's transform this once</p>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} src="https://ik.imagekit.io/gqyojxcwzxj/ABC_BV8lzpfOS" transformation={[{
        "height": "200",
        "width": "200"
      }]} />
      <p>Let's transform this more than once</p>
      <IKImage publicKey={publicKey} urlEndpoint={urlEndpoint} path="/ABC_BV8lzpfOS" transformation={[{
        "height": "200",
        "width": "200",
      },
      {
        "rotation": "90"
      }]} />
      <p>Adding a Image with Context</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path="/ABC_BV8lzpfOS" transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </IKContext>
      <p>LQIP</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path="/ABC_BV8lzpfOS" lqip={{ active: true, quality: 30 }} />
      </IKContext>
      <p>Upload</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload fileName="test_new" useUniqueFileName={false} isPrivateFile= {true} />
      </IKContext>
      <p>To use this funtionality please remember to setup the server</p>
    </div>
  );
}

export default App;
