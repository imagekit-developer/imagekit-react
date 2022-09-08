import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import IKVideo from '../../src/components/IKVideo';

const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';
const relativePath = 'default-image.jpg';
const absolutePath = `${urlEndpoint}/${relativePath}`;
const absolutePathWithQuery = `${absolutePath}?foo=bar`
const nestedImagePath = '/sample-folder/default-image.jpg';

const differentImageRelativePath = 'different-image.jpg';
const differentAbsolutePath = `${urlEndpoint}/${differentImageRelativePath}`;
const differentUrlEndpoint = 'http://ik.imagekit.io/different_imagekit_id';

const trArr = [{height : 300, width : 300}];

describe('IKVideo', () => {
  describe('Absolute video path', () => {
    test("src should be present", () => {
      const ikVideo = shallow(<IKVideo urlEndpoint={urlEndpoint} src={absolutePath} />);

      expect(ikVideo.find('video').find('source').prop('src')).toEqual(`${absolutePath}?${global.SDK_VERSION}`);
    });
  });
  describe('state update on props', () => {

    test("change src in props and <video /> src should change accordingly", () => {
        const ikVideo = mount(<IKVideo urlEndpoint={urlEndpoint} src={absolutePath} />);
        
        expect(ikVideo.props().src).toEqual(absolutePath);
        expect(ikVideo.state('currentUrl')).toEqual(`${absolutePath}?${global.SDK_VERSION}`);
        expect(ikVideo.find('video').find('source').prop('src')).toEqual(`${absolutePath}?${global.SDK_VERSION}`);

        ikVideo.setProps({ src: differentAbsolutePath });

        expect(ikVideo.props().src).toEqual(differentAbsolutePath);
        expect(ikVideo.state('currentUrl')).toEqual(`${differentAbsolutePath}?${global.SDK_VERSION}`);
        ikVideo.update();
        expect(ikVideo.find('video').find('source').prop('src')).toEqual(`${differentAbsolutePath}?${global.SDK_VERSION}`);

        // trigger unmount
        ikVideo.unmount();
    });
  })
});
