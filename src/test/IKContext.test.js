import React from 'react'
import { mount } from 'enzyme';
import IKImage from '../components/IKImage';
import IKUpload from '../components/IKUpload';
import IKContext from '../components/IKContext';

const authenticationEndpoint = 'test_auth_endpoint';
const path = 'default-image.jpg';
const publicKey = 'test_public_key';
const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';

describe('IKContext snapshots', () => {
  test('with only urlEndpoint', () => {
    const ikContext = mount(
      <IKContext urlEndpoint={urlEndpoint} >
        <IKImage path={path} transformation={[{
          height: 300,
          width: 400
        }]} />
      </IKContext>
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.0.7">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg';
    expect(ikContext.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
  });

  test('with publicKey and urlEndpoint', () => {
    const ikContext = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path={path} transformation={[{
          height: 300,
          width: 400
        }]} />
      </IKContext>
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.0.7">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg';
    expect(ikContext.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
    // public key is found via context in the child component
    expect(ikContext.find('IKImage').instance().getContext().publicKey).toEqual(publicKey);
  });

  test('with publicKey, urlEndpoint and authenticationEndpoint', () => {
    const ikContext = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload onError={() => { }} onSuccess={() => { }} />
      </IKContext>
    );
    // '<input type="file">'
    expect(ikContext.html()).toEqual('<input type="file">');
    const childContext = ikContext.find('IKUpload').instance().getContext();
    // all props are found via context in the child component
    expect(childContext.publicKey).toEqual(publicKey);
    expect(childContext.urlEndpoint).toEqual(urlEndpoint);
    expect(childContext.authenticationEndpoint).toEqual(authenticationEndpoint);
  });

  test('overriding urlEndpoint', () => {
    const ikContext = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path={path} urlEndpoint='https://www.custom-domain.com/' transformation={[{
          height: 300,
          width: 400
        }]} />
      </IKContext>
    );
    // <img alt="" src="https://www.custom-domain.com/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.0.7">

    const transformURL = 'https://www.custom-domain.com/tr:h-300,w-400/default-image.jpg';
    expect(ikContext.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
  });
});
