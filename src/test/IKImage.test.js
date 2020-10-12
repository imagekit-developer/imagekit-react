import React from 'react';
import { shallow } from 'enzyme';
import IKImage from '../components/IKImage';

const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';
const relativePath = 'default-image.jpg';
const absolutePath = `${urlEndpoint}/${relativePath}`;
const absolutePathWithQuery = `${absolutePath}?foo=bar`
const nestedImagePath = '/sample-folder/default-image.jpg';

describe('IKImage snapshots', () => {
  describe('absolute image path', () => {
    test("src with alt attribute", () => {
      const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} src={absolutePath} alt={'some text here'} />);
      // <img alt="abc" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg
      // ?ik-sdk-version=react-1.0.7"/>

      expect(ikImage.find('img').prop('src')).toEqual(`${absolutePath}?${global.SDK_VERSION}`);
      expect(ikImage.find('img').prop('alt')).toEqual('some text here');

    });

    test("src with query parameters", () => {
      const ikImage = shallow(
        <IKImage
          urlEndpoint={urlEndpoint}
          src={absolutePathWithQuery}
          queryParameters={{ version: 5, name: 'check' }}
        />
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?foo=bar
      // &ik-sdk-version=react-1.0.7&version=5&name=check"/>

      const transformURL = `${absolutePath}?foo=bar&${global.SDK_VERSION}&version=5&name=check`;
      expect(ikImage.find('img').prop('src')).toEqual(transformURL);
    });

    test("src with transformation", () => {
      const ikImage = shallow(
        <IKImage
          urlEndpoint={urlEndpoint}
          src={absolutePath}
          transformation={[{
            height: 300,
            width: 400
          }]} />
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg
      // ?ik-sdk-version=react-1.0.7&tr=h-300%2Cw-400"/>

      const transformURL = `${absolutePath}?${global.SDK_VERSION}&tr=h-300%2Cw-400`;
      expect(ikImage.find('img').prop('src')).toEqual(transformURL);
    });

    test("src with lqip", () => {
      const ikImage = shallow(
        <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} src={absolutePath} id="lqip" />
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg
      // ?ik-sdk-version=react-1.0.7&tr=q-20%2Cbl-6" id="lqip"/>

      const transformURL = `${absolutePath}?${global.SDK_VERSION}&tr=q-20%2Cbl-6`;
      expect(ikImage.find('img').prop('src')).toEqual(transformURL);
    });

    test("src with transformation and lqip", () => {
      const ikImage = shallow(
        <IKImage
          urlEndpoint={urlEndpoint}
          lqip={{ active: true, quality: 20 }}
          src={absolutePath}
          transformation={[{
            height: 300,
            width: 400
          }]}
          id="lqip"
        />
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg
      // ?ik-sdk-version=react-1.0.7&tr=h-300%2Cw-400%3Aq-20%2Cbl-6" id="lqip"/>

      const transformURL = `${absolutePath}?${global.SDK_VERSION}&tr=h-300%2Cw-400%3Aq-20%2Cbl-6`;
      expect(ikImage.find('img').prop('src')).toEqual(transformURL);
    });
  });

  describe('relative image path', () => {
    test("path with alt attribute", () => {
      const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path={relativePath} alt={'some text here'} />);
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7"/>

      expect(ikImage.find('img').prop('src')).toEqual(`${absolutePath}?${global.SDK_VERSION}`);
      expect(ikImage.find('img').prop('alt')).toEqual('some text here');
    });

    test("path with query parameters", () => {
      const ikImage = shallow(
        <IKImage urlEndpoint={urlEndpoint} path={relativePath} queryParameters={{ version: 5, name: 'check' }} />
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7
      // &version=5&name=check"/>

      const transformURL = `${absolutePath}?${global.SDK_VERSION}&version=5&name=check`;
      expect(ikImage.find('img').prop('src')).toEqual(transformURL);
    });

    test("path having leading slashes", () => {
      const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path="////default-image.jpg" />);
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7"/>

      expect(ikImage.find('img').prop('src')).toEqual(`${absolutePath}?${global.SDK_VERSION}`);
    });

    test("path with url endpoint having trailing slashes", () => {
      const ikImage = shallow(
        <IKImage urlEndpoint="http://ik.imagekit.io/test_imagekit_id////" path={relativePath} />
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7"/>

      expect(ikImage.find('img').prop('src')).toEqual(`${absolutePath}?${global.SDK_VERSION}`);
    });

    test("path with lqip", () => {
      const ikImage = shallow(
        <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} path={relativePath} id="lqip" />
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:q-20,bl-6/default-image.jpg?
      // ik-sdk-version=react-1.0.7" id="lqip"/>

      const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:q-20,bl-6/default-image.jpg';
      expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
      expect(ikImage.find('img').prop('id')).toEqual('lqip');
    });

    test("path with transformations", () => {
      const ikImage = shallow(
        <IKImage urlEndpoint={urlEndpoint} path={relativePath} transformation={[{
          height: 300,
          width: 400
        }]} />
      );
      // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg
      // ?ik-sdk-version=react-1.0.7"/>

      const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg';
      expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
    });
  });

  test("path with transformations and lqip", () => {
    const ikImage = shallow(
      <IKImage
        urlEndpoint={urlEndpoint}
        lqip={{ active: true, quality: 20 }}
        path={relativePath}
        transformation={[{
          height: 300,
          width: 400
        }]}
        id="lqip"
      />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:q-20,bl-6/default-image.jpg
    // ?ik-sdk-version=react-1.0.7" id="lqip"/>

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:q-20,bl-6/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
    expect(ikImage.find('img').prop('id')).toEqual('lqip');
  });

  test("nested path with lqip", () => {
    const ikImage = shallow(
      <IKImage
        urlEndpoint={urlEndpoint}
        lqip={{ active: true, quality: 50, blur: 25 }}
        path={nestedImagePath}
        transformation={[{
          height: 300,
          width: 400
        }]}
        id="lqip"
      />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:q-50,bl-25/sample-folder/
    // default-image.jpg?ik-sdk-version=react-1.0.7" id="lqip"/>

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:q-50,bl-25/sample-folder/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
    expect(ikImage.find('img').prop('id')).toEqual('lqip');
  });
});
