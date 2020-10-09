import React from 'react';
import { shallow } from 'enzyme';
import IKImage from '../components/IKImage';
import ErrorBoundary from '../components/ErrorBoundary';

const urlEndpoint = 'http://ik.imagekit.io/demo';
const relativePath = 'default-image.jpg';
const absolutePath = `${urlEndpoint}/${relativePath}`;
const absolutePathWithQuery = `${absolutePath}?foo=bar`
const nestedImagePath = '/sample-folder/default-image.jpg';

describe('IKImage: Snapshot migrated tests', () => {
  test("imageWithSrc", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} src={absolutePath} alt="abc" />);
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithPath", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path={relativePath} />);
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithQueryParameters", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path={relativePath} queryParameters={{ version: 5, name: 'check' }} />);
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithSrcQueryParameters", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} src={absolutePathWithQuery} queryParameters={{ version: 5, name: 'check' }} />);
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("leadingSlashesInPath", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path="////default-image.jpg" />);
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("trailingSlashesInUrlEndpoint", () => {
    const ikImage = shallow(<IKImage urlEndpoint="http://ik.imagekit.io/demo////" path={relativePath} />);
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithLQIPWithSrcNoTransformation", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} src={absolutePath} id="lqip" />);
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithLQIPWithSrcWithTransformation", () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} src={absolutePath} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip" />
    );
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithLQIPWithPathNoTransformation", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} path={relativePath} id="lqip" />);
    const imageWithLQIPWithPathNoTransformation = 'http://ik.imagekit.io/demo/tr:q-20,bl-6/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toMatch(imageWithLQIPWithPathNoTransformation);
  });

  test("imageWithLQIPWithPathWithTransformation", () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} path={relativePath} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip" />
    );
    const imageWithLQIPWithPathWithTransformation = 'http://ik.imagekit.io/demo/tr:h-300,w-400:q-20,bl-6/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toMatch(imageWithLQIPWithPathWithTransformation);
  });

  test("nestedImagePathWithLQIP", () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 50, blur: 25 }} path={nestedImagePath} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip" />
    );
    const nestedImagePathWithLQIP = 'http://ik.imagekit.io/demo/tr:h-300,w-400:q-50,bl-25/sample-folder/default-image.jpg';
    expect(ikImage.find('img').prop('src')).toMatch(nestedImagePathWithLQIP);
  });

  test("imageWithTransformations", () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} src={absolutePath} transformation={[{
        height: 300,
        width: 400
      }]} />
    );
    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("missingUrlEndpointFail", () => {
    const ikImage = shallow(
      <ErrorBoundary>
        <IKImage transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>
    );

    expect(ikImage.find('img')).toBeNull;
  });

  test("imageUrlEndpointFail", () => {
    const ikImage = shallow(
      <ErrorBoundary>
        <IKImage path={relativePath} transformation={[{
          "height": "300",
          "width": "400"
        }]} />
      </ErrorBoundary>
    );
    expect(ikImage.find('img')).toBeNull;
  });
});
