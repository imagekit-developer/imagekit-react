import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import IKImage from '../components/IKImage';
import ErrorBoundary from '../components/ErrorBoundary';

const relativePath = 'default-image.jpg';

describe('ErrorBoundary', () => {
  test("handles error thrown by child component", () => {
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

    expect(errorBoundary.state().hasError).toEqual(true);
    expect(spy.callCount).toEqual(1);
    expect(spy.args).toEqual([[error, { componentStack: errStackTrace }]]);

    spy.restore();
  });
});

describe('ErrorBoundary snapshots', () => {
  describe('IKImage', () => {
    beforeEach(() => {
      // stub console.error to prevent logging on test screen
      jest.spyOn(console, 'error')
      console.error.mockImplementation(() => { });
    });

    afterEach(() => {
      // restore console.error function
      console.error.mockRestore();
    });

    test("missingUrlEndpointFail", () => {
      const ikImageError = mount(
        <ErrorBoundary>
          <IKImage transformation={[{
            "height": "300",
            "width": "400"
          }]} />
        </ErrorBoundary>
      );

      // output will be an error div like:
      // <h1>Error: Missing urlEndpoint during initialization</h1>
      // at Object.<anonymous> (src/test/ErrorBoundary.test.js:63:15)

      expect(ikImageError.find('img')).toBeNull;
      expect(ikImageError.text()).toMatch('Error: Missing urlEndpoint during initialization');
    });

    test("imageUrlEndpointFail", () => {
      const ikImageError = mount(
        <ErrorBoundary>
          <IKImage path={relativePath} transformation={[{
            "height": "300",
            "width": "400"
          }]} />
        </ErrorBoundary>
      );

      // output will be an error div like:
      // <h1>Error: Missing urlEndpoint during initialization</h1>
      // at Object.<anonymous> (src/test/ErrorBoundary.test.js:63:15)

      expect(ikImageError.find('img')).toBeNull;
      expect(ikImageError.text()).toMatch('Error: Missing urlEndpoint during initialization');
    });
  });
});
