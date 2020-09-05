// Polyfill for `Object.is(..)`

/**
 * Instruction:
 * 1. 相对 `===`，`Ojbect.is()` 要考虑两种额外的情况：NaN 与 NaN 的比较以及 0 与 -0 的比较
 * 2. 由于 JS 没有内置的判断 -0 的方法，可以考虑使用 `-Infinity` 来判断 -0
 * 3. 判断一个值是否为 NaN 有几种方法，`isNaN()` 和 `Number.isNaN()` 是两个内置的方法，
 *    区别是前者会先对参数进行隐式转换而后者不会。另外还有一种不需要使用内置 API 的判断方法，
 *    利用了 `NaN 是唯一不与自身相等的值` 这个特性。
 */

// *******************************

if (!Object.is || true) {
    // code here
}

// tests:
console.log(Object.is(42, 42) === true);
console.log(Object.is('foo', 'foo') === true);
console.log(Object.is(false, false) === true);
console.log(Object.is(null, null) === true);
console.log(Object.is(undefined, undefined) === true);
console.log(Object.is(NaN, NaN) === true);
console.log(Object.is(-0, -0) === true);
console.log(Object.is(0, 0) === true);

console.log(Object.is(-0, 0) === false);
console.log(Object.is(0, -0) === false);
console.log(Object.is(0, NaN) === false);
console.log(Object.is(NaN, 0) === false);
console.log(Object.is(42, '42') === false);
console.log(Object.is('42', 42) === false);
console.log(Object.is('foo', 'bar') === false);
console.log(Object.is(false, true) === false);
console.log(Object.is(null, undefined) === false);
console.log(Object.is(undefined, null) === false);

// *******************************

if (!Object.is) {
    Object.is = function ObjectIs(x, y) {
        var xNegZero = isItNegZero(x);
        var yNegZero = isItNegZero(y);

        if (xNegZero || yNegZero) return xNegZero && yNegZero;
        else if (isItNaN(x) && isItNaN(y)) return true;
        return x === y;

        // *********
        function isItNegZero(x) {
            return x === 0 && 1 / x === -Infinity;
        }
        function isItNaN(x) {
            return x !== x;
        }
    };
}
