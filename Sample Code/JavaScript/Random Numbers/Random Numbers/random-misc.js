// ------------------------------------------------------------------
//
// Mersenne Twister (MT) + some other useful random number generators
//
// MT Reference: https://en.wikipedia.org/wiki/Mersenne_Twister
// MT Implementation Reference: https://gist.github.com/banksean/300494
//
// ------------------------------------------------------------------
let Random = (function () {
    'use strict';

    /* Period parameters */
    let N = 624;
    let M = 397;
    let MATRIX_A = 0x9908b0df;   /* constant vector a */
    let UPPER_MASK = 0x80000000; /* most significant w-r bits */
    let LOWER_MASK = 0x7fffffff; /* least significant r bits */

    let mt = new Array(N); /* the array for the state vector */
    let mti = N + 1; /* mti==N+1 means mt[N] is not initialized */

    function setSeed(seed) {
        mt[0] = seed >>> 0;
        for (mti = 1; mti < N; mti++) {
            var s = mt[mti - 1] ^ (mt[mti - 1] >>> 30);
            mt[mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                + mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            mt[mti] >>>= 0;
            /* for >32 bit machines */
        }
    }

    /* generates a random number on [0,0xffffffff]-interval */
    function next() {
        var y;
        var mag01 = new Array(0x0, MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (mti >= N) { /* generate N words at one time */
            var kk;

            if (mti == N + 1)   /* if init_genrand() has not been called, */
                setSeed((new Date()).getTime());

            for (kk = 0; kk < N - M; kk++) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < N - 1; kk++) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
            mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            mti = 0;
        }

        y = mt[mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }

    function nextDouble() {
        return (next() + 0.5) * (1.0 / 4294967296.0);
    }

    function nextRange(min, max) {
        var range = max - min + 1;
        return Math.floor((nextDouble() * range) + min);
    }

    function nextCircleVector() {
        var angle = nextDouble() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    //
    // This is used to give a small performance optimization in generating gaussian random numbers.
    var usePrevious = false,
        y2;

    //
    // Generate a normally distributed random number.
    //
    // NOTE: This code is adapted from a wiki reference I found a long time ago.  I originally
    // wrote the code in C# and am now converting it over to JavaScript.
    //
    function nextGaussian(mean, stdDev) {
        if (usePrevious) {
            usePrevious = false;
            return mean + y2 * stdDev;
        }

        usePrevious = true;

        var x1 = 0,
            x2 = 0,
            y1 = 0,
            z = 0;

        do {
            x1 = 2 * nextDouble() - 1;
            x2 = 2 * nextDouble() - 1;
            z = (x1 * x1) + (x2 * x2);
        } while (z >= 1);

        z = Math.sqrt((-2 * Math.log(z)) / z);
        y1 = x1 * z;
        y2 = x2 * z;

        return mean + y1 * stdDev;
    }

    setSeed((new Date()).getTime());

    return {
        setSeed, setSeed,
        next: next,
        nextDouble: nextDouble,
        nextRange: nextRange,
        nextCircleVector: nextCircleVector,
        nextGaussian: nextGaussian
    };

}());


for (i = 0; i < 10; i++) {
    console.log(Random.nextGaussian(83, 10));
}
