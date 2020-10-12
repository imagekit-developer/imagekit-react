import React from 'react'
import { shallow } from 'enzyme';
import IKImage from '../../src/components/IKImage';

const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';
const path = 'default-image.jpg';
const src = `${urlEndpoint}/${path}`;

describe('IKImage transformation snapshots', () => {
  test('single transformation', () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        height: 300
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300/default-image.jpg
    // ?ik-sdk-version=react-1.0.7">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
  });

  test('transformation position as query', () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        height: 300,
        width: 400
      }]} transformationPosition="query" />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg
    // ?ik-sdk-version=react-1.0.7&tr=h-300%2Cw-400">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/default-image.jpg';
    const queryParams = 'tr=h-300%2Cw-400';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}&${queryParams}`);
  });

  test('transformation position as path while using relative image path', () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        height: 300,
        width: 400
      }]} transformationPosition="path" />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg
    // ?ik-sdk-version=react-1.0.7">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
  });

  test('transformation position as path while using absolute image path', () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} src={src} transformation={[{
        height: 300,
        width: 400
      }]} transformationPosition="path" />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg
    // ?ik-sdk-version=react-1.0.7&tr=h-300%2Cw-400">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/default-image.jpg';
    const queryParams = 'tr=h-300%2Cw-400';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}&${queryParams}`);
  });

  test('chained transformations', () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        height: 300,
        width: 400
      }, {
        'rotation': 90
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:rt-90/default-image.jpg
    // ?ik-sdk-version=react-1.0.7">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:rt-90/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
  });

  test('non-existent transformation', () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        'foo': 'bar',
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:foo-bar/default-image.jpg
    // ?ik-sdk-version=react-1.0.7">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:foo-bar/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
  });

  test('non-existent transformation with existing transformation', () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        'foo': 'bar',
        height: 300
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:foo-bar,h-300/default-image.jpg
    // ?ik-sdk-version=react-1.0.7">

    const transformURL = 'http://ik.imagekit.io/test_imagekit_id/tr:foo-bar,h-300/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toEqual(`${transformURL}?${global.SDK_VERSION}`);
  });
});
