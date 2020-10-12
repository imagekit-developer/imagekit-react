import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import pkg from '../../package.json';

// Configure Enzyme with React 16 adapter
Enzyme.configure({ adapter: new Adapter() });

// global test variables
global.SDK_VERSION = `ik-sdk-version=react-${pkg.version}`;
