// ------------------------------------------------------------------
//
// Xorshift
//
// Reference: https://en.wikipedia.org/wiki/Xorshift
// Implementation Reference: https://github.com/AndreasMadsen/xorshift/blob/master/xorshift.js
//
// ------------------------------------------------------------------
let Random = (function () {
    'use strict';
    let _state0U = 0;
    let _state0L = 0;
    let _state1U = 0;
    let _state1L = 0;

    function setSeed(seed) {
        if (!Array.isArray(seed) || seed.length !== 4) {
            throw new TypeError('seed must be an array with 4 numbers');
        }

        // uint64_t s = [seed ...]
        _state0U = seed[0] | 0;
        _state0L = seed[1] | 0;
        _state1U = seed[2] | 0;
        _state1L = seed[3] | 0;
    }

    function next() {
        // uint64_t s1 = s[0]
        var s1U = _state0U, s1L = _state0L;
        // uint64_t s0 = s[1]
        var s0U = _state1U, s0L = _state1L;

        // result = s0 + s1
        var sumL = (s0L >>> 0) + (s1L >>> 0);
        var resU = (s0U + s1U + (sumL / 2 >>> 31)) >>> 0;
        var resL = sumL >>> 0;

        // s[0] = s0
        _state0U = s0U;
        _state0L = s0L;

        // - t1 = [0, 0]
        var t1U = 0, t1L = 0;
        // - t2 = [0, 0]
        var t2U = 0, t2L = 0;

        // s1 ^= s1 << 23;
        // :: t1 = s1 << 23
        var a1 = 23;
        var m1 = 0xFFFFFFFF << (32 - a1);
        t1U = (s1U << a1) | ((s1L & m1) >>> (32 - a1));
        t1L = s1L << a1;
        // :: s1 = s1 ^ t1
        s1U = s1U ^ t1U;
        s1L = s1L ^ t1L;

        // t1 = ( s1 ^ s0 ^ ( s1 >> 17 ) ^ ( s0 >> 26 ) )
        // :: t1 = s1 ^ s0
        t1U = s1U ^ s0U;
        t1L = s1L ^ s0L;
        // :: t2 = s1 >> 18
        var a2 = 18;
        var m2 = 0xFFFFFFFF >>> (32 - a2);
        t2U = s1U >>> a2;
        t2L = (s1L >>> a2) | ((s1U & m2) << (32 - a2));
        // :: t1 = t1 ^ t2
        t1U = t1U ^ t2U;
        t1L = t1L ^ t2L;
        // :: t2 = s0 >> 5
        var a3 = 5;
        var m3 = 0xFFFFFFFF >>> (32 - a3);
        t2U = s0U >>> a3;
        t2L = (s0L >>> a3) | ((s0U & m3) << (32 - a3));
        // :: t1 = t1 ^ t2
        t1U = t1U ^ t2U;
        t1L = t1L ^ t2L;

        // s[1] = t1
        _state1U = t1U;
        _state1L = t1L;

        // return result
        return [resU, resL];
    }

    function nextDouble() {
        var t2 = next();
        // Math.pow(2, -32) = 2.3283064365386963e-10
        // Math.pow(2, -52) = 2.220446049250313e-16
        return t2[0] * 2.3283064365386963e-10 + (t2[1] >>> 12) * 2.220446049250313e-16;
    }

    return {
        setSeed, setSeed,
        next: next,
        nextDouble: nextDouble
    };

}());

Random.setSeed([100, 200, 300, 400]);
for (i = 0; i < 100; i++) {
    console.log(Random.nextDouble());
}
