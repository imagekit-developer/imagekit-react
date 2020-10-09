import React from 'react'
import { mount } from 'enzyme';
import IKImage from '../components/IKImage';
import IKContext from '../components/IKContext';

const publicKey = 'test_public_key';
const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';
const path = 'default-image.jpg';

describe('IKContext snapshots', () => {
  test('imageKitContext', () => {
    const ikContext = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path={path} transformation={[{
          height: 300,
          width: 400
        }]} />
      </IKContext>
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.0.7">

    expect(ikContext.find('img').prop('src')).toMatch('http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg');
  });

  test('OverRidingUrlEndpoint', () => {
    const ikContext = mount(
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} >
        <IKImage path={path} urlEndpoint='https://www.custom-domain.com/' transformation={[{
          height: 300,
          width: 400
        }]} />
      </IKContext>
    );
    // <img alt="" src="https://www.custom-domain.com/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.0.7">

    expect(ikContext.find('img').prop('src')).toMatch('https://www.custom-domain.com/tr:h-300,w-400/default-image.jpg');
  });
});
