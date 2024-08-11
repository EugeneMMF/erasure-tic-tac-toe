const myModule = require('./game');
const validate = myModule.validate;
const isEnd = myModule.isEnd;
const getNextPlayer = myModule.getNextPlayer;
const getBestPlay = myModule.getBestPlay;
const spyConsoleLog = jest.spyOn(console, 'log');
spyConsoleLog.mockImplementation(keys=>keys);

// Tests for validate

test('returns true if validate exists', () => {
    expect(validate).toBeDefined();
})

test('throws error when the argument is not of type array', () => {
    expect(() => {validate('hi');}).toThrow("The argument must be of type array");
})

test('throws error when the argument is not of type array', () => {
    expect(() => {validate({1:2});}).toThrow("The argument must be of type array");
})

test('throws error when length of array is less than 9', () => {
    expect(() => {validate([0,0,0,0,0,0,0,0]);}).toThrow("The length of the array must be 9");
})

test('throws error when length of array is greater than 9', () => {
    expect(() => {validate([0,0,0,0,0,0,0,0,0,0]);}).toThrow("The length of the array must be 9");
})

test('throws error when the array has a value that is not either a 0 or 1 or -1', () => {
    expect(() => {validate([1,0,-1,0,0,2,0,0,0]);}).toThrow("Unexpected value in the array");
})

test('throws error when the array has a sum out of range of [-1,1] - sum is 2', () => {
    expect(() => {validate([1,0,-1,0,0,1,1,0,0]);}).toThrow("Invalid board, players must switch");
})

test('throws error when the array has a sum out of range of [-1,1] sum is -2', () => {
    expect(() => {validate([-1,0,-1,0,0,-1,1,0,0]);}).toThrow("Invalid board, players must switch");
})

test('throws error when the array contains a value that is not a number', () => {
    expect(() => {validate([-1,"j",-1,0,0,-1,1,0,0]);}).toThrow("Unexpected value in the array");
})

test('throws error when the array contains a value that is not an integer', () => {
    expect(() => {validate([-1,0.1,-1,0,0,-1,1,0,0]);}).toThrow("Found non integer value in the array");
})

// Tests for isEnd

test('returns true if isEnd exists', () => {
    expect(isEnd).toBeDefined();
})

test('returns 1 if 1 is main diagonal winner', () => {
    expect(isEnd([1,-1,-1,0,1,-1,1,0,1])).toBe(1);
})

test('returns -1 if -1 is main diagonal winner', () => {
    expect(isEnd([1,1,-1,0,-1,-1,-1,1,1])).toBe(-1);
})

test('returns 1 if 1 is horizontal winner on row 1', () => {
    expect(isEnd([1,1,1,0,-1,-1,-1,0,1])).toBe(1);
})

test('returns 1 if 1 is horizontal winner on row 2', () => {
    expect(isEnd([0,-1,-1,1,1,1,-1,0,1])).toBe(1);
})

test('returns -1 if -1 is horizontal winner on row 3', () => {
    expect(isEnd([0,1,1,1,0,1,-1,-1,-1])).toBe(-1);
})

test('returns 1 if 1 is vertical winner on column 1', () => {
    expect(isEnd([1,-1,1,1,-1,-1,1,0,1])).toBe(1);
})

test('returns 1 if 1 is vertical winner on column 2', () => {
    expect(isEnd([0,1,-1,-1,1,1,-1,1,-1])).toBe(1);
})

test('returns -1 if -1 is vertical winner on column 3', () => {
    expect(isEnd([0,1,-1,1,0,-1,1,1,-1])).toBe(-1);
})

test('returns 0 if draw on column 3', () => {
    expect(isEnd([1,-1,1,-1,-1,1,1,1,-1])).toBe(0);
})

test('returns 2 if no winner and incomplete on column 3', () => {
    expect(isEnd([1,-1,1,-1,-1,0,1,1,-1])).toBe(2);
})

// Tests for getNextPlayer

test('returns true if getNextPlayer exists', () => {
    expect(getNextPlayer).toBeDefined();
})

test('returns 1 if next player is 1', () => {
    expect(getNextPlayer([1,-1,1,-1,-1,0,1,1,-1])).toBe(1);
})

test('returns -1 if next player is -1', () => {
    expect(getNextPlayer([1,-1,1,0,-1,0,1,1,-1])).toBe(-1);
})

test('throws error sum of board is greater than 1 or less than 0', () => {
    expect(() => {getNextPlayer([-1,0,-1,0,0,-1,1,0,0]);}).toThrow("Invalid board, sum was neither 1 nor 0");
})

// Tests for getBestPlay

test('returns true if getBestPlay exists', () => {
    expect(getBestPlay).toBeDefined();
})

// test('test console log inside statusOfKeys', () => {
//     getBestPlay([0,0]);
//     expect(console.log).toBeCalled()
//     expect(spyConsoleLog.mock.calls[0][0]).toBe(true)
//     spyConsoleLog.mockReset()
//     spyConsoleLog.mockRestore()
// })