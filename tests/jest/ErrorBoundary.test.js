import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import IKImage from '../../src/components/IKImage';
import ErrorBoundary from '../../src/components/ErrorBoundary';

const urlEndpoint = 'http://ik.imagekit.io/test_imagekit_id';
const relativePath = 'default-image.jpg';

describe('ErrorBoundary', () => {
  describe('Error handling', () => {
    test('handles error thrown by child component and renders message', () => {
      // fake component
      class TestComponent extends React.Component { };

      const errorBoundary = shallow(
        <ErrorBoundary ><TestComponent /></ErrorBoundary>
      );

      const spy = sinon.spy(errorBoundary.instance(), 'componentDidCatch');
      const error = new Error('random error');
      const errStackTrace = `
    in TestComponent (created by ErrorBoundary)
    in ErrorBoundary (created by WrapperComponent)
    in WrapperComponent`;

      // simulate error from child component
      errorBoundary.find(TestComponent).simulateError(error);

      // output will be an error div like:
      // <h1>Error: random error</h1>
      // at Object.<anonymous> (src/test/ErrorBoundary.test.js:30:15)

      expect(errorBoundary.state().hasError).toEqual(true);
      expect(errorBoundary.text()).toMatch('Error: random error');

      // verify spy
      expect(spy.callCount).toEqual(1);
      expect(spy.args).toEqual([[error, { componentStack: errStackTrace }]]);

      spy.restore();
    });
  });

  describe('Snapshots', () => {
    describe('IKImage errors', () => {
      beforeEach(() => {
        // stub console.error to prevent logging on test screen
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => { });
      });

      afterEach(() => {
        // restore console.error function
        console.error.mockRestore();
      });

      test('should render ErrorBoundary for missing urlEndpoint and relative path', () => {
        const ikImageError = mount(
          <ErrorBoundary>
            <IKImage transformation={[{
              height: 300,
              width: 400
            }]} />
          </ErrorBoundary>
        );

        // output will be an error div like:
        // <h1>Error: Missing urlEndpoint during initialization</h1>
        // at Object.<anonymous> (src/test/ErrorBoundary.test.js:63:15)

        expect(ikImageError.find('img').length).toEqual(0);
        expect(ikImageError.text()).toMatch('Error: Missing urlEndpoint during initialization');
      });

      test('should render ErrorBoundary for missing urlEndpoint', () => {
        const ikImageError = mount(
          <ErrorBoundary>
            <IKImage path={relativePath} transformation={[{
              height: 300,
              width: 400
            }]} />
          </ErrorBoundary>
        );

        // output will be an error div like:
        // <h1>Error: Missing urlEndpoint during initialization</h1>
        // at Object.<anonymous> (src/test/ErrorBoundary.test.js:63:15)

        expect(ikImageError.find('img').length).toEqual(0);
        expect(ikImageError.text()).toMatch('Error: Missing urlEndpoint during initialization');
      });

      test('should not render ErrorBoundary for missing relative path', () => {
        const ikImageError = mount(
          <ErrorBoundary>
            <IKImage urlEndpoint={urlEndpoint} transformation={[{
              height: 300,
              width: 400
            }]} />
          </ErrorBoundary>
        );

        // <img alt="" src="">

        expect(ikImageError.find('img').length).toEqual(1);
        expect(ikImageError.find('img').prop('src')).toEqual('');
      });
    });
  });
});
