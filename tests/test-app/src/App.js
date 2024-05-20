import React, { useState, useRef } from 'react';
import './App.css';
import { IKImage, IKContext, IKUpload, IKVideo } from 'imagekitio-react'

function App() {
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;
  const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
  const authenticationEndpoint = process.env.REACT_APP_AUTHENTICATION_ENDPOINT;
  let reftest = useRef(null);
  const [error, setError] = useState();
  const [isUploading, setIsUploading] = useState(null);
  const [uploadProgress, setUploadProgress] = useState();
  const [uploadedImageSource, setUploadedImageSource] = useState();
  const [imageTr, setImageTr] = useState([{
    "height": "200",
    "width": "200"
  }]);
  const [imageTrSansIKContext, setImageTrSansIKContext] = useState([{
    "height": "300",
    "width": "300"
  }]);
  const [overrideParametersValue, setoverrideParametersValue] = useState();

  const path = "default-image.jpg";
  const videoUrlEndpoint = 'https://ik.imagekit.io/demo/';
  const videoPath = "sample-video.mp4";

  const src = `${urlEndpoint}/${path}`;

  const onError = err => {
    console.log("Error");
    console.log(JSON.stringify(err));
    setError({ uploadFileErr: err.message });
    setIsUploading(false)
  };

  const onSuccess = res => {
    console.log("Success");
    console.log(res);
    console.log(res.$ResponseMetadata.statusCode); // 200
    console.log(res.$ResponseMetadata.headers); // headers
    setUploadedImageSource(res.url);
    setIsUploading(false)
  };

  const authenticator = async () => {
    try {

      // You can pass headers as well and later validate the request source in the backend, or you can use headers for any other use case.
      const response = await fetch(authenticationEndpoint);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onUploadStart = (_) => {
    setIsUploading(true)
  }

  const onUploadProgress = (e) => {
    setUploadProgress(e)
  }

  const onOverrideParameters = (file) => {
    setoverrideParametersValue({
      file
    })
  }

  return (
    <div className="App">
      <input type="text" className="state-value" value={JSON.stringify({
        error,
        isUploading,
        uploadProgress,
        uploadedImageSource,
        imageTr,
        overrideParametersValue
      })} style={{ display: 'none' }}></input>
      <h1>Hi! This is an ImageKit React SDK Demo!</h1>

      <p>Directly using <code>IkImage</code></p>
      <IKImage urlEndpoint={urlEndpoint} src={src} />

      <p>Dynamic transformation update directly using IKImage</p>
      <IKImage
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
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
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
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
          ref={reftest}
          className="file-upload-ik"
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          overrideParameters={onOverrideParameters}
        />
        {isUploading !== null ? <p>{isUploading ? `...Uploading (${uploadProgress ? uploadProgress.type ? (uploadProgress.loaded / uploadProgress.total * 100).toFixed(2) + '%)' : '' : ''}` : 'uploaded'}</p> : <></>}
        {isUploading ? <button onClick={() => {
          reftest.current.abort()
          setIsUploading(null);
        }}>Cancel</button> : <></>}
        <p>Custom Upload Button</p>
        {reftest && <button onClick={() => reftest.current.click()}>Upload</button>}

        <p>Your above uploaded file will appear here </p>
        <IKImage urlEndpoint={urlEndpoint} src={uploadedImageSource} className="uploaded-img-ik" transformation={[{
          "height": "200",
          "width": "200",
        }]} />


        <p>Upload invalid file</p>
        <IKUpload
          className={"file-upload-error"}
          folder={"/sample-folder"}
          onError={onError}
          onSuccess={onSuccess}
        />

        {(error && error.hasOwnProperty('uploadFileErr')) && <p style={{ color: 'red' }} className='upload-error-ik'>{'File upload failed.'}</p>}
      </IKContext>

      <IKContext publicKey={publicKey} urlEndpoint={videoUrlEndpoint}>
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
    </div >
  );
}

export default App;

