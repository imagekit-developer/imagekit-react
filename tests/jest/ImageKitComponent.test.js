import React from 'react'
import { shallow } from 'enzyme';
import ImageKitComponent from '../../src/components/ImageKitComponent';

describe('ImageKitComponent', () => {
  describe('Snapshots', () => {
    test('should render null', () => {
      const imagekitComponent = shallow(
        <ImageKitComponent />
      );
      // renders: null
      expect(imagekitComponent.html()).toEqual(null);
    });
  });
});
