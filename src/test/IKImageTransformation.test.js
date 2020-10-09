import React from 'react'
import { mount } from 'enzyme';
import IKImage from '../../src/components/IKImage';

const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';
const path = 'default-image.jpg';
const src = `${urlEndpoint}/${path}`;

// NOTE: improve query param matching
describe('IKImage transformation snapshots', () => {
  test('imageWithSingleTransformations', () => {
    const ikImage = mount(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        height: 300,
        width: 400
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg?ik-sdk-version=react-1.0.7">

    expect(ikImage.find('img').prop('src')).toMatch('http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400/default-image.jpg');
  });

  test('imageWithTransformationPositionAsQuery', () => {
    const ikImage = mount(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        height: 300,
        width: 400
      }]} transformationPosition="query" />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7&tr=h-300%2Cw-400">

    expect(ikImage.find('img').prop('src')).toMatch('http://ik.imagekit.io/test_imagekit_id/default-image.jpg');
    expect(ikImage.find('img').prop('src')).toMatch('&tr=h-300%2Cw-400');
  });

  test('imageWithTransformationPositionAsPathPassingSrc', () => {
    const ikImage = mount(
      <IKImage urlEndpoint={urlEndpoint} src={src} transformation={[{
        height: 300,
        width: 400
      }]} transformationPosition="path" />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7&tr=h-300%2Cw-400">

    expect(ikImage.find('img').prop('src')).toMatch('http://ik.imagekit.io/test_imagekit_id/default-image.jpg');
    expect(ikImage.find('img').prop('src')).toMatch('&tr=h-300%2Cw-400');
  });

  test('imageWithChainedTransformations', () => {
    const ikImage = mount(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        height: 300,
        width: 400
      }, {
        'rotation': 90
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:rt-90/default-image.jpg?ik-sdk-version=react-1.0.7">

    expect(ikImage.find('img').prop('src')).toMatch('http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:rt-90/default-image.jpg');
  });

  test('imageWithNonExistingTransformation', () => {
    const ikImage = mount(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        'foo': 'bar',
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:foo-bar/default-image.jpg?ik-sdk-version=react-1.0.7">

    expect(ikImage.find('img').prop('src')).toMatch('http://ik.imagekit.io/test_imagekit_id/tr:foo-bar/default-image.jpg');
  });

  test('imageWithNonExistingTransformationWithExistingTransformation', () => {
    const ikImage = mount(
      <IKImage urlEndpoint={urlEndpoint} path={path} transformation={[{
        'foo': 'bar',
        height: 300
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:foo-bar,h-300/default-image.jpg?ik-sdk-version=react-1.0.7">

    expect(ikImage.find('img').prop('src')).toMatch('http://ik.imagekit.io/test_imagekit_id/tr:foo-bar,h-300/default-image.jpg');
  });
});
