const myModule = require('./manager');
const getBestPlay = myModule.getBestPlay;

test('returns 4', () => {
    expect(getBestPlay([ 1, 0, 0, 0, 0, 0, 1, 0, -1 ], 3, 3, 3, [ 0, 6 ], [ 8, ])).toBe(3);
})