import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { IKContext, IKImage, IKUpload, IKCore, IKVideo } from 'imagekitio-react'
function App() {
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;
  const urlEndpoint = process.env.REACT_APP_URL_ENDPOINT;
  const authenticationEndpoint = process.env.REACT_APP_AUTHENTICATION_ENDPOINT;

  const videoUrlEndpoint = 'https://ik.imagekit.io/demo/';

  const path = "default-image.jpg";
  const videoPath = "sample-video.mp4";

  const src = `${urlEndpoint}/${path}`;

  const customXHR = new XMLHttpRequest();
  customXHR.upload.addEventListener('progress', function (e) {
    console.log("File uploading in progress")
  });

  useEffect(() => {
    createCustomImg()
  })

  const onStart = (file, xhr) => {
    console.log("file", file)
    console.log("xhr", xhr)
  }

  const onError = err => {
    console.log("Error");
    console.log(err);
    setError({ uploadFileErr: err.message })
  };

  const onSuccess = res => {
    console.log("Success");
    console.log(res);
    console.log(res.$ResponseMetadata.statusCode); // 200
    console.log(res.$ResponseMetadata.headers); // headers
    setUploadedImageSource(res.url);
  };

  const [uploadedImageSource, setUploadedImageSource] = useState();
  const [imageTr, setImageTr] = useState([{
    "height": "200",
    "width": "200"
  }]);
  const [imageTrSansIKContext, setImageTrSansIKContext] = useState([{
    "height": "300",
    "width": "300"
  }]);

  let reftest = useRef(null)
  const [imgIkcore, setImgIkCore] = useState('');
  const [error, setError] = useState();

  const createCustomImg = () => {
    const imagekit = new IKCore({
      urlEndpoint: urlEndpoint
    });
    if (imagekit) {
      try {
        let imageURL = imagekit.url({
          path: "/default-image.jpg",
          urlEndpoint: urlEndpoint,
          transformation: [{
            "height": "300",
            "width": "400"
          }]
        });
        setImgIkCore(imageURL)
      } catch (err) {
        console.log("err", err.message)
      }
    }
  }

  return (
    <div className="App">
      <h1>Hi! This is an ImageKit React SDK Demo!</h1>

      <p>Directly using <code>IkImage</code></p>
      <IKImage urlEndpoint={urlEndpoint} src={src} />

      <p>Dynamic transformation update directly using IKImage</p>
      <IKImage
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticationEndpoint={authenticationEndpoint}
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
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
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
          onStart={onStart}
          onError={onError}
          onSuccess={onSuccess}
          inputRef={reftest}
          xhr={customXHR}
        />

        <p>Your above uploaded file will appear here </p>
        <IKImage urlEndpoint={urlEndpoint} src={uploadedImageSource} />

        <h3>Upload invalid file</h3>
        <IKUpload
          className={"file-upload-error"}
          folder={"/sample-folder"}
          onError={onError}
          onSuccess={onSuccess}
        />

        {(error && error.hasOwnProperty('uploadFileErr')) && <p style={{ color: 'red' }} className='upload-error-ik'>{'Your request contains invalid file type.'}</p>}
      </IKContext>

      <h1>Custom Upload Button</h1>
      {reftest && <button onClick={() => reftest.current.click()}>Upload</button>}

      <h1>Render Image Using IKCore Sdk</h1>
      {imgIkcore && <IKImage urlEndpoint={urlEndpoint} src={imgIkcore} className="image-ikcore" />}

      <IKContext publicKey={publicKey} authenticationEndpoint={authenticationEndpoint} urlEndpoint={videoUrlEndpoint}>
        <h1>Video Element</h1>
        <IKVideo
          className='ikvideo-default'
          path={videoPath}
          transformation={[{ height: 200, width: 200 }]}
          controls={true}
        />

        <br />
        <h3>Video with some advance transformation</h3>
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

