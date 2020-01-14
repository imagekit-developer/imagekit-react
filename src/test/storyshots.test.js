import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({ /* configuration options */ });

// Dates get changed in snapshots depending on timezone of bulding machine,
// So we set a default date or moment for all dates.
const DATE_TO_USE = new Date('2019');
const _Date = Date;
global.Date = jest.fn(() => DATE_TO_USE);
global.Date.UTC = _Date.UTC;
global.Date.parse = _Date.parse;
global.Date.now = _Date.now;
