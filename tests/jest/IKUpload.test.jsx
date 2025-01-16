import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ImageKitComponent from '../../src/components/ImageKitComponent';
import ImageKitProvider from '../../src/components/ImageKitProvider';
import IKUpload from '../../src/components/IKUpload';

const publicKey = 'test_public_key';
const urlEndpoint = 'http://ik.imagekit.io/test_url_endpoint';
const authenticationEndpoint = 'test_auth_endpoint';

const sampleEvent = { target: { files: [{ name: 'sample.jpg' }] } };
const sampleEmptyEvent = { target: { files: [] } };
const successResponse = { key: 'upload success response' };
const failureResponse = { key: 'upload failure response' };
const ikClientCalledObj = {
  file: sampleEvent.target.files[0],
  fileName: sampleEvent.target.files[0].name,
  useUniqueFileName: true,
  tags: [],
  folder: "/",
  isPrivateFile: false,
  customCoordinates: "",
  responseFields: [],
};

const onChange = sinon.spy();
const onUploadStart = sinon.spy();
const onUploadProgress = sinon.spy();
const onError = sinon.spy();
const onSuccess = sinon.spy();
const mockXMLHttpRequest = () => {
  const mock = {
    open: jest.fn(),
    addEventListener: jest.fn(),
    setRequestHeader: jest.fn(),
    send: jest.fn(),
    getResponseHeader: jest.fn(),
    abort: sinon.spy(),

    upload: {
      // addEventListener: (name, cb) => evtListeners.push(cb),
      // removeEventListener: (name, cb) => evtListeners.pop(),
      // progress: evtListeners[0],
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  };

  window.XMLHttpRequest = jest.fn(() => mock);

  return mock;
};
let mockXMLHttpRequestObj = null;

const uploadMock = (params, callback, auth) => {
  try {
    const { xhr, ...paramsWithoutXhr } = params;
    const [[, progress]] = mockXMLHttpRequestObj.upload.addEventListener.mock.calls;
    progress({ loaded: 12, total: 100 });
    // verify upload call params
    expect(params).toEqual({
      file: { name: 'sample.jpg' },
      fileName: 'sample.jpg',
      useUniqueFileName: true,
      tags: [],
      folder: '/',
      isPrivateFile: false,
      customCoordinates: '',
      responseFields: [],
      xhr: mockXMLHttpRequestObj,
    });
    expect(auth).toEqual({
      publicKey: 'test_public_key',
      authenticationEndpoint: 'test_auth_endpoint'
    });
    // if all matches, return success response
    callback(null, successResponse);
  } catch (err) {
    console.log(err);
    // if any assertion fails, return error response
    callback(failureResponse);
  }
}

const ikInstance = {
  options: {
    urlEndpoint: urlEndpoint,
    transformationPosition: 'path'
  },
  url() { },
  upload: uploadMock,
};

describe('IKUpload', () => {
  describe('Upload event handling', () => {
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
      onUploadStart.resetHistory();
      onUploadProgress.resetHistory();
      mockXMLHttpRequestObj = mockXMLHttpRequest();

      ikInstanceUploadStub.callsFake(uploadMock);
    });

    describe('Success case', () => {
      test('should successfully upload file', () => {
        // mount component
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} />
          </ImageKitProvider>
        );

        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(ikInstanceUploadStub.called).toEqual(false)

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);

        // verify upload spy
        expect(ikInstanceUploadStub.calledOnce).toEqual(true);
        expect(ikInstanceUploadStub.calledWithMatch(ikClientCalledObj)).toEqual(true);

        // verify success callback
        expect(onSuccess.calledOnce).toEqual(true)
        expect(onSuccess.args[0][0]).toEqual(successResponse);
      });
    });

    describe('Failure cases', () => {
      test('should call onError for missing publicKey', () => {
        const ikUpload = mount(
          <ImageKitProvider urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} />
          </ImageKitProvider>
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
          <ImageKitProvider publicKey={publicKey} authenticationEndpoint={authenticationEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} />
          </ImageKitProvider>
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
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} />
          </ImageKitProvider>
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

      test('should not call upload or onError for missing urlEndpoint and missing onError', () => {
        const ikUpload = mount(
          <ImageKitProvider  authenticationEndpoint={authenticationEndpoint} publicKey={publicKey} >
            <IKUpload onSuccess={onSuccess} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(ikInstanceUploadStub.called).toEqual(false)

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);

        // verify upload spy
        expect(ikInstanceUploadStub.called).toEqual(false);
        expect(onError.calledOnce).toEqual(false);
      });

      test('should not call upload for missing publickKey and missing onError', () => {
        const ikUpload = mount(
          <ImageKitProvider  authenticationEndpoint={authenticationEndpoint} urlEndpoint={urlEndpoint} >
            <IKUpload onSuccess={onSuccess} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(ikInstanceUploadStub.called).toEqual(false)

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);

        // verify upload spy
        expect(ikInstanceUploadStub.called).toEqual(false);
        expect(onError.calledOnce).toEqual(false);
      });

      test('should not call upload for missing file', () => {
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} authenticationEndpoint={authenticationEndpoint} urlEndpoint={urlEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(ikInstanceUploadStub.called).toEqual(false)

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEmptyEvent);

        // verify upload spy
        expect(ikInstanceUploadStub.called).toEqual(false);
        expect(onError.calledOnce).toEqual(false);
      });

      test('should not call upload for missing authenticationEndpoint and missing onError', () => {
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} >
            <IKUpload onSuccess={onSuccess} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(ikInstanceUploadStub.called).toEqual(false)

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);

        // verify upload spy
        expect(ikInstanceUploadStub.called).toEqual(false);
        expect(onError.calledOnce).toEqual(false);
      });

      test('should not call onError in case server returns error response and missing onError', () => {
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint}>
            <IKUpload onSuccess={onSuccess} />
          </ImageKitProvider>
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
        expect(ikInstanceUploadStub.calledWithMatch(ikClientCalledObj)).toEqual(true);

        // verify error callback
        expect(onError.calledOnce).toEqual(false);
      });

      test('should not call onSuccess in case server returns error response and missing onSuccess', () => {
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint}>
            <IKUpload onError={onError} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(ikInstanceUploadStub.called).toEqual(false)

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);

        // verify upload spy
        expect(ikInstanceUploadStub.calledOnce).toEqual(true);
        expect(ikInstanceUploadStub.calledWithMatch(ikClientCalledObj)).toEqual(true);

        // verify error callback
        expect(onSuccess.calledOnce).toEqual(false);
      });

      test('should call onError in case server returns error response', () => {
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint}>
            <IKUpload onError={onError} onSuccess={onSuccess} />
          </ImageKitProvider>
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
        expect(ikInstanceUploadStub.calledWithMatch(ikClientCalledObj)).toEqual(true);

        // verify error callback
        expect(onError.calledOnce).toEqual(true)
        expect(onError.args[0][0]).toEqual(serverError);
      });
    });

    describe('General cases', () => {
      test('should call onChange when file input changes', () => {
        // mount component
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} onChange={onChange} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(onChange.called).toEqual(false);

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);

        // verify change callback
        expect(onChange.calledOnce).toEqual(true);
        expect(onChange.calledWithMatch(sampleEvent)).toEqual(true);
      });
      test('should call onUploadStart when file input changes', () => {
        // mount component
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} onUploadStart={onUploadStart} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(onUploadStart.called).toEqual(false);

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);

        // verify change callback
        expect(onUploadStart.calledOnce).toEqual(true);
        expect(onUploadStart.calledWithMatch(sampleEvent)).toEqual(true);
      });

      test('should not upload file if validateFile fails', () => {
        // mount component
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} validateFile={() => false} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(ikInstanceUploadStub.called).toEqual(false);

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);

        // verify change callback
        expect(ikInstanceUploadStub.called).toEqual(false);
      });

      test('should call onUploadProgress during file upload', () => {
        // mount component
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} onUploadProgress={onUploadProgress} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(onUploadProgress.called).toEqual(false);

        // trigger file change and upload 
        ikUpload.find('IKUpload').simulate('change', sampleEvent);
        expect(ikInstanceUploadStub.calledOnce).toEqual(true);
        expect(ikInstanceUploadStub.calledWithMatch(ikClientCalledObj)).toEqual(true);

        // verify change callback
        expect(onUploadProgress.called).toEqual(true);
        expect(onUploadProgress.calledWithMatch({ loaded: 12, total: 100 })).toEqual(true);
        
        // verify success callback
        expect(onSuccess.calledOnce).toEqual(true)
        expect(onSuccess.calledWithMatch(successResponse)).toEqual(true);
      });

      test('should call abort on xhr', () => {
        // mount component
        const ref = React.createRef();
        const ikUpload = mount(
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
            <IKUpload onError={onError} onSuccess={onSuccess} ref={ref} />
          </ImageKitProvider>
        );
        // verify setup integrity
        expect(ikUpload.html()).toEqual('<input type="file">');
        expect(ikUpload.find(IKUpload).getElement().ref).toBe(ref);
        ref.current.abort();
        expect(mockXMLHttpRequestObj.abort.called).toEqual(false);
        ikUpload.find('IKUpload').simulate('change', sampleEvent);
        ref.current.abort();
        expect(mockXMLHttpRequestObj.abort.called).toEqual(true);
      });
    });

	describe('props update', () => {
		test('upload with no urlEndpoint should throw error, then after should succed updating urlEndpoint in ImageKitProvider with state change', () => {
			// mount component
			const ikUpload = mount(
				<ImageKitProvider publicKey={publicKey} authenticationEndpoint={authenticationEndpoint} >
					<IKUpload onError={onError} onSuccess={onSuccess} />
				</ImageKitProvider>
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
			
			//update urlEndpoint in ImageKitProvider
			ikUpload.setProps({ urlEndpoint });
			ikUpload.update();
			//Now after updating urlEndpoint in ImageKitProvider, it should successfully upload

			// verify setup integrity
			expect(ikUpload.html()).toEqual('<input type="file">');
			expect(ikInstanceUploadStub.called).toEqual(false)
	
			// trigger file change and upload 
			ikUpload.find('IKUpload').simulate('change', sampleEvent);
	
			// verify upload spy
			expect(ikInstanceUploadStub.calledOnce).toEqual(true);
      expect(ikInstanceUploadStub.calledWithMatch(ikClientCalledObj)).toEqual(true);
	
			// verify success callback
			expect(onSuccess.calledOnce).toEqual(true)
			expect(onSuccess.args[0][0]).toEqual(successResponse);

			// trigger unmount
			ikUpload.unmount();
		});

		test('upload with no publicKey should throw error, then after should succed updating publicKey in ImageKitProvider with state change', () => {
			// mount component
			const ikUpload = mount(
				<ImageKitProvider urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
					<IKUpload onError={onError} onSuccess={onSuccess} />
				</ImageKitProvider>
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
			
			//update publicKey in ImageKitProvider
			ikUpload.setProps({ publicKey });
			ikUpload.update();
			//Now after updating publicKey in ImageKitProvider, it should successfully upload

			// verify setup integrity
			expect(ikUpload.html()).toEqual('<input type="file">');
			expect(ikInstanceUploadStub.called).toEqual(false)
	
			// trigger file change and upload 
			ikUpload.find('IKUpload').simulate('change', sampleEvent);
	
			// verify upload spy
			expect(ikInstanceUploadStub.calledOnce).toEqual(true);
      expect(ikInstanceUploadStub.calledWithMatch(ikClientCalledObj)).toEqual(true);
	
			// verify success callback
			expect(onSuccess.calledOnce).toEqual(true)
			expect(onSuccess.args[0][0]).toEqual(successResponse);

			// trigger unmount
			ikUpload.unmount();
		});
		
		test('upload with no authenticationEndpoint should throw error, then after should succed updating authenticationEndpoint in ImageKitProvider with state change', () => {
			// mount component
			const ikUpload = mount(
				<ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} >
					<IKUpload onError={onError} onSuccess={onSuccess} />
				</ImageKitProvider>
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
			
			//update authenticationEndpoint in ImageKitProvider
			ikUpload.setProps({ authenticationEndpoint });
			ikUpload.update();
			//Now after updating authenticationEndpoint in ImageKitProvider, it should successfully upload

			// verify setup integrity
			expect(ikUpload.html()).toEqual('<input type="file">');
			expect(ikInstanceUploadStub.called).toEqual(false)
	
			// trigger file change and upload 
			ikUpload.find('IKUpload').simulate('change', sampleEvent);
	
			// verify upload spy
			expect(ikInstanceUploadStub.calledOnce).toEqual(true);
      expect(ikInstanceUploadStub.calledWithMatch(ikClientCalledObj)).toEqual(true);
	
			// verify success callback
			expect(onSuccess.calledOnce).toEqual(true)
			expect(onSuccess.args[0][0]).toEqual(successResponse);

			// trigger unmount
			ikUpload.unmount();
		});
	})
	
  });

  describe('Snapshots', () => {
    test('should render with full auth context and onError and onSuccess props', () => {
      const ikUpload = mount(
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
          <IKUpload onError={onError} onSuccess={onSuccess} />
        </ImageKitProvider>
      );
      expect(ikUpload.html()).toEqual('<input type="file">');
    });

    test('should render with full auth context and all the props', () => {
      const ikUpload = mount(
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
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
        </ImageKitProvider>
      );
      expect(ikUpload.html()).toEqual('<input type="file">');
    });

    test('should render with full auth context and without fileName prop', () => {
      const ikUpload = mount(
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
          <IKUpload useUniqueFileName={true} onError={onError} onSuccess={onSuccess} />
        </ImageKitProvider>
      );
      expect(ikUpload.html()).toEqual('<input type="file">');
    });

    test('should render without authenticationEndpoint in auth context', () => {
      const ikUpload = mount(
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
          <IKUpload />
        </ImageKitProvider>
      );
      expect(ikUpload.html()).toEqual('<input type="file">');
    });
  });
});
