import React from 'react';
import { shallow } from 'enzyme';
import IKImage from '../components/IKImage';
import ErrorBoundary from '../components/ErrorBoundary';

const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';
const relativePath = 'default-image.jpg';
const absolutePath = `${urlEndpoint}/${relativePath}`;
const absolutePathWithQuery = `${absolutePath}?foo=bar`
const nestedImagePath = '/sample-folder/default-image.jpg';

// NOTE: check all transform strings
describe('IKImage: Snapshot migrated tests', () => {
  test("imageWithSrc", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} src={absolutePath} alt="abc" />);
    // <img alt="abc" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7"/>

    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithPath", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path={relativePath} />);
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7"/>

    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithQueryParameters", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path={relativePath} queryParameters={{ version: 5, name: 'check' }} />);
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7&amp;version=5&amp;name=check"/>

    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithSrcQueryParameters", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} src={absolutePathWithQuery} queryParameters={{ version: 5, name: 'check' }} />);
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?foo=bar&amp;ik-sdk-version=react-1.0.7&amp;version=5&amp;name=check"/>

    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("leadingSlashesInPath", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} path="////default-image.jpg" />);
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7"/>

    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("trailingSlashesInUrlEndpoint", () => {
    const ikImage = shallow(<IKImage urlEndpoint="http://ik.imagekit.io/test_imagekit_id////" path={relativePath} />);
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7"/>

    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithLQIPWithSrcNoTransformation", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} src={absolutePath} id="lqip" />);
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7&amp;tr=q-20%2Cbl-6" id="lqip"/>

    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithLQIPWithSrcWithTransformation", () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} src={absolutePath} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip" />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7&amp;tr=h-300%2Cw-400%3Aq-20%2Cbl-6" id="lqip"/>

    expect(ikImage.find('img').prop('src')).toMatch(absolutePath);
  });

  test("imageWithLQIPWithPathNoTransformation", () => {
    const ikImage = shallow(<IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} path={relativePath} id="lqip" />);
    const imageWithLQIPWithPathNoTransformation = 'http://ik.imagekit.io/test_imagekit_id/tr:q-20,bl-6/default-image.jpg';
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:q-20,bl-6/default-image.jpg?ik-sdk-version=react-1.0.7" id="lqip"/>

    expect(ikImage.find('img').prop('src')).toMatch(imageWithLQIPWithPathNoTransformation);
  });

  test("imageWithLQIPWithPathWithTransformation", () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 20 }} path={relativePath} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip" />
    );
    const imageWithLQIPWithPathWithTransformation = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:q-20,bl-6/default-image.jpg';
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:q-20,bl-6/default-image.jpg?ik-sdk-version=react-1.0.7" id="lqip"/>

    expect(ikImage.find('img').prop('src')).toMatch(imageWithLQIPWithPathWithTransformation);
  });

  test("nestedImagePathWithLQIP", () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} lqip={{ active: true, quality: 50, blur: 25 }} path={nestedImagePath} transformation={[{
        height: 300,
        width: 400
      }]} id="lqip" />
    );
    const nestedImagePathWithLQIP = 'http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:q-50,bl-25/sample-folder/default-image.jpg';
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/tr:h-300,w-400:q-50,bl-25/sample-folder/default-image.jpg?ik-sdk-version=react-1.0.7" id="lqip"/>

    expect(ikImage.find('img').prop('src')).toMatch(nestedImagePathWithLQIP);
  });

  test("imageWithTransformations", () => {
    const ikImage = shallow(
      <IKImage urlEndpoint={urlEndpoint} src={absolutePath} transformation={[{
        height: 300,
        width: 400
      }]} />
    );
    // <img alt="" src="http://ik.imagekit.io/test_imagekit_id/default-image.jpg?ik-sdk-version=react-1.0.7&amp;tr=h-300%2Cw-400"/>

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
