import React from 'react';
import { mount } from 'enzyme';
import IKContext from '../../src/components/IKContext';
import IKUpload from '../../src/components/IKUpload';

const publicKey = 'test_public_key';
const urlEndpoint = 'http://ik.imagekit.io/test_url_endpoint';
const authenticationEndpoint = 'test_auth_endpoint';

let onError = err => {
  console.log('Error');
};

let onSuccess = res => {
  console.log('Success');
};

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
