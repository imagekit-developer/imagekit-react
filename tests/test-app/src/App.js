import React, { useState, useRef } from 'react';
import './App.css';
import { IKImage, IKContext, IKUpload, IKVideo } from 'imagekitio-react'

function App() {
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;
  const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
  const authenticationEndpoint = process.env.REACT_APP_AUTHENTICATION_ENDPOINT;
  let reftest = useRef(null);
  const [error, setError] = useState();

  const path = "default-image.jpg";
  const videoUrlEndpoint = 'https://ik.imagekit.io/demo/';
  const videoPath = "sample-video.mp4";

  const src = `${urlEndpoint}/${path}`;

  const onError = err => {
    console.log("Error");
    console.log(JSON.stringify(err));
    setError({ uploadFileErr: err.message });
  };

  const onSuccess = res => {
    console.log("Success");
    console.log(res);
    console.log(res.$ResponseMetadata.statusCode); // 200
    console.log(res.$ResponseMetadata.headers); // headers
    setUploadedImageSource(res.url);
  };

  const authenticator = () => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.timeout = 6000; //modify if required
      var url = authenticationEndpoint;
      if (url.indexOf("?") === -1) {
        url += `?t=${Math.random().toString()}`;
      } else {
        url += `&t=${Math.random().toString()}`;
      }
      xhr.open('GET', url);
      xhr.ontimeout = function (e) {
        reject(["Authentication request timed out in 60 seconds", xhr]);
      };
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            var body = JSON.parse(xhr.responseText);
            var obj = {
              signature: body.signature,
              expire: body.expire,
              token: body.token
            }
            resolve(obj);
          } catch (ex) {
            reject([ex, xhr]);
          }
        } else {
          try {
            var error = JSON.parse(xhr.responseText);
            reject([error, xhr]);
          } catch (ex) {
            reject([ex, xhr]);
          }
        }
      });
      xhr.send();
    })
  }

  const [uploadedImageSource, setUploadedImageSource] = useState();

  const [imageTr, setImageTr] = useState([{
    "height": "200",
    "width": "200"
  }]);
  const [imageTrSansIKContext, setImageTrSansIKContext] = useState([{
    "height": "300",
    "width": "300"
  }]);

  return (
    <div className="App">
      <h1>Hi! This is an ImageKit React SDK Demo!</h1>

      <p>Directly using <code>IkImage</code></p>
      <IKImage urlEndpoint={urlEndpoint} src={src} />

      <p>Dynamic transformation update directly using IKImage</p>
      <IKImage
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        // authenticationEndpoint={authenticationEndpoint}
        className={'img-transformation-direct'}
        path={path}
        transformation={imageTrSansIKContext}
      />
      <div>
        <p>Click here to apply transformations on the above image</p>
        <button
          className={'btn-to-change-tr-direct'}
          onClick={() => setImageTrSansIKContext([{
            "height": "200",
            "width": "600",
            "radius": "max",
          }, {
            "height": "200",
            "width": "200",
            "rotate": 180,
          }, {
            "ot": "TEST",
            "oy": 50,
            "ox": 100,
            "otc": "10C0F0"
          }])}
        >Click to apply transformations</button>
      </div>
      <br />

      <p>Using context <code>IKContext</code></p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint}
        // authenticationEndpoint={authenticationEndpoint} 
        authenticator={authenticator}
      >
        <p>Let's add an Image</p>
        <IKImage src={src} />

        <p>Transformation - height and width manipulation</p>
        <IKImage className={'img-transformation'} path={path} transformation={imageTr} />
        <div>
          <p>Click here to apply max radius on above image </p>
          <button
            className={'btn-to-change-tr'}
            onClick={() => setImageTr([{
              "height": "200",
              "width": "200",
              "radius": "max"
            }])}
          >Click to apply radius</button>
        </div>
        <br />
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
          className={'lazyload'}
          path={path}
          transformation={[{
            "height": "200",
            "width": "200"
          }]}
          loading="lazy"
        />

        <p>Progressive image loading wihtout lazy loading</p>
        <IKImage
          className={'lqip'}
          path={path}
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
          className={'lazyload-lqip'}
          path={path}
          transformation={[{
            "height": "200",
            "width": "200"
          }]}
          loading="lazy"
          lqip={{ active: true, quality: 20, blur: 30 }}
        />

        <p>File upload along with upload API options - To use this funtionality please remember to setup the server</p>
        <IKUpload
          fileName="test.jpg"
          tags={["sample-tag1", "sample-tag2"]}
          customCoordinates={"10,10,10,10"}
          isPrivateFile={false}
          useUniqueFileName={true}
          responseFields={["tags"]}
          folder={"/sample-folder"}
          onError={onError}
          onSuccess={onSuccess}
          inputRef={reftest}
          className="file-upload-ik"
        />
        <p>Custom Upload Button</p>
        {reftest && <button onClick={() => reftest.current.click()}>Upload</button>}

        <p>Your above uploaded file will appear here </p>
        <IKImage urlEndpoint={urlEndpoint} src={uploadedImageSource} className="uploaded-img-ik" />


        <p>Upload invalid file</p>
        <IKUpload
          className={"file-upload-error"}
          folder={"/sample-folder"}
          onError={onError}
          onSuccess={onSuccess}
        />

        {(error && error.hasOwnProperty('uploadFileErr')) && <p style={{ color: 'red' }} className='upload-error-ik'>{'File upload failed.'}</p>}
      </IKContext>

      <IKContext publicKey={publicKey}
        // authenticationEndpoint={authenticationEndpoint} 
        urlEndpoint={videoUrlEndpoint}>
        <p>Video Element</p>
        <IKVideo
          className='ikvideo-default'
          path={videoPath}
          transformation={[{ height: 200, width: 200 }]}
          controls={true}
        />

        <br />
        <p>Video with some advance transformation</p>
        <IKVideo
          className='ikvideo-with-tr'
          path={videoPath}
          transformation={[{ height: 200, width: 600, b: '5_red', q: 95 }]}
          controls={true}
        />
      </IKContext>
    </div>
  );
}

export default App;

