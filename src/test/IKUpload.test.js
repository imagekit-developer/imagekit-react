import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ImageKitComponent from "../../src/components/ImageKitComponent";
import IKContext from '../../src/components/IKContext';
import IKUpload from '../../src/components/IKUpload';

const publicKey = 'test_public_key';
const urlEndpoint = 'http://ik.imagekit.io/test_url_endpoint';
const authenticationEndpoint = 'test_auth_endpoint';

const sampleEvent = { target: { files: [{ name: 'sample.jpg' }] } };
const successResponse = { key: 'upload success response' };
const failureResponse = { key: 'upload failure response' };

const onChange = sinon.spy();
const onError = sinon.spy();
const onSuccess = sinon.spy();

const uploadMock = (params, callback, auth) => {
  try {
    // verify upload call params
    expect(params).toEqual({
      file: { name: 'sample.jpg' },
      fileName: 'sample.jpg',
      useUniqueFileName: true,
      tags: [],
      folder: '/',
      isPrivateFile: false,
      customCoordinates: '',
      responseFields: []
    });
    expect(auth).toEqual({
      publicKey: 'test_public_key',
      authenticationEndpoint: 'test_auth_endpoint'
    });
    // if all matches, return success response
    callback(null, successResponse);
  } catch (err) {
    // if any assertion fails, return error response
    callback(failureResponse);
  }
}

const ikInstance = {
  options: {
    sdkVersion: `react-imagekit-sdk-${global.SDK_VERSION}`,
    urlEndpoint: urlEndpoint,
    transformationPosition: 'path'
  },
  url() { },
  upload: uploadMock,
};

describe('IKUpload', () => {
  let imageKitComponentStub;
  let ikInstanceUploadStub;

  // setup stubs and spies
  imageKitComponentStub = sinon.stub(ImageKitComponent.prototype, 'getIKClient');
  imageKitComponentStub.callsFake(() => ikInstance);
  ikInstanceUploadStub = sinon.stub(ikInstance, 'upload');

  beforeEach(() => {
    // reset stubs
    imageKitComponentStub.resetHistory();
    ikInstanceUploadStub.resetHistory();
    onSuccess.resetHistory();
    onError.resetHistory();

    ikInstanceUploadStub.callsFake(uploadMock);
  });

  describe('Success case', () => {
    test('should successfully upload file', () => {
      // mount component
      const ikUpload = mount(
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
          <IKUpload onError={onError} onSuccess={onSuccess} />
        </IKContext>
      );

      // verify setup integrity
      expect(ikUpload.html()).toEqual('<input type="file">');
      expect(ikInstanceUploadStub.called).toEqual(false)

      // trigger file change and upload 
      ikUpload.find('IKUpload').simulate('change', sampleEvent);

      // verify upload spy
      expect(ikInstanceUploadStub.calledOnce).toEqual(true);

      // verify success callback
      expect(onSuccess.calledOnce).toEqual(true)
      expect(onSuccess.args[0][0]).toEqual(successResponse);
    });
  });

  describe('Failure cases', () => {
    test('should call onError for missing publicKey', () => {
      const ikUpload = mount(
        <IKContext urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
          <IKUpload onError={onError} onSuccess={onSuccess} />
        </IKContext>
      );
      // verify setup integrity
      expect(ikUpload.html()).toEqual('<input type="file">');
      expect(ikInstanceUploadStub.called).toEqual(false)

      // trigger file change and upload 
      ikUpload.find('IKUpload').simulate('change', sampleEvent);

      // verify upload spy
      expect(ikInstanceUploadStub.called).toEqual(false);

      // verify error callback
      expect(onError.calledOnce).toEqual(true)
      expect(onError.args[0][0]).toEqual({ message: 'Missing publicKey' });
    });

    test('should call onError for missing urlEndpoint', () => {
      const ikUpload = mount(
        <IKContext publicKey={publicKey} authenticationEndpoint={authenticationEndpoint} >
          <IKUpload onError={onError} onSuccess={onSuccess} />
        </IKContext>
      );
      // verify setup integrity
      expect(ikUpload.html()).toEqual('<input type="file">');
      expect(ikInstanceUploadStub.called).toEqual(false)

      // trigger file change and upload 
      ikUpload.find('IKUpload').simulate('change', sampleEvent);

      // verify upload spy
      expect(ikInstanceUploadStub.called).toEqual(false);

      // verify error callback
      expect(onError.calledOnce).toEqual(true)
      expect(onError.args[0][0]).toEqual({ message: 'Missing urlEndpoint' });
    });

    test('should call onError for missing authenticationEndpoint', () => {
      const ikUpload = mount(
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
          <IKUpload onError={onError} onSuccess={onSuccess} />
        </IKContext>
      );
      // verify setup integrity
      expect(ikUpload.html()).toEqual('<input type="file">');
      expect(ikInstanceUploadStub.called).toEqual(false)

      // trigger file change and upload 
      ikUpload.find('IKUpload').simulate('change', sampleEvent);

      // verify upload spy
      expect(ikInstanceUploadStub.called).toEqual(false);

      // verify error callback
      expect(onError.calledOnce).toEqual(true)
      expect(onError.args[0][0]).toEqual({ message: 'Missing authenticationEndpoint' });
    });

    test('should call onError in case server returns error response', () => {
      const ikUpload = mount(
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint}>
          <IKUpload onError={onError} onSuccess={onSuccess} />
        </IKContext>
      );
      // verify setup integrity
      expect(ikUpload.html()).toEqual('<input type="file">');
      expect(ikInstanceUploadStub.called).toEqual(false)

      const serverError = new Error('server error');
      // make upload mock function return error
      ikInstanceUploadStub.callsFake((params, callback, auth) => callback(serverError))

      // trigger file change and upload 
      ikUpload.find('IKUpload').simulate('change', sampleEvent);

      // verify upload spy
      expect(ikInstanceUploadStub.calledOnce).toEqual(true);

      // verify error callback
      expect(onError.calledOnce).toEqual(true)
      expect(onError.args[0][0]).toEqual(serverError);
    });
  });

  describe('General cases', () => {
    test('should call onChange when file input changes', () => {
      // mount component
      const ikUpload = mount(
        <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
          <IKUpload onError={onError} onSuccess={onSuccess} onChange={onChange} />
        </IKContext>
      );
      // verify setup integrity
      expect(ikUpload.html()).toEqual('<input type="file">');
      expect(onChange.called).toEqual(false);

      // trigger file change and upload 
      ikUpload.find('IKUpload').simulate('change', sampleEvent);

      // verify change callback
      expect(onChange.calledOnce).toEqual(true);
    });
  });
});

describe('IKUpload snapshots', () => {
  test('with authentication', () => {
    const ikUpload = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload onError={onError} onSuccess={onSuccess} />
      </IKContext>
    );
    expect(ikUpload.html()).toEqual('<input type="file">');
  });

  test('with all the props', () => {
    const ikUpload = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload
          useUniqueFileName={false}
          tags={['tag1', 'tag2']}
          folder="/"
          isPrivateFile={true}
          customCoordinates="0,0,0,0"
          responseFields={['isPrivateFile', 'customCoordinates']}
          onError={onError}
          onSuccess={onSuccess}
        />
      </IKContext>
    );
    expect(ikUpload.html()).toEqual('<input type="file">');
  });

  test('without fileName prop', () => {
    const ikUpload = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload useUniqueFileName={true} onError={onError} onSuccess={onSuccess} />
      </IKContext>
    );
    expect(ikUpload.html()).toEqual('<input type="file">');
  });

  test('without authentication', () => {
    const ikUpload = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint}>
        <IKUpload />
      </IKContext>
    );
    expect(ikUpload.html()).toEqual('<input type="file">');
  });
});
