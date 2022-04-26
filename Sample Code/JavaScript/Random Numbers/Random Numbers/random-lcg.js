// ------------------------------------------------------------------
//
// Linear Congruential Generator (LCG)
//
// Reference: https://en.wikipedia.org/wiki/Linear_congruential_generator
//
// ------------------------------------------------------------------
let Random = (function() {
    'use strict';
    // Following C++ 11: m = 2^32 - 1, a = 48271, c = 0
    let m = 4294967295;
    let a = 47271;
    let c = 0;
    let z = 3;  // The seed

    // Use these to demonstrate the period
    // let m = 25;
    // let a = 11;
    // let c = 17;

    function setSeed(seed) {
        z = seed
    }

    function next() {
        z = (a * z + c) % m;
        return z;
    }

    function nextDouble() {
        return next() / m;
    }

    return {
        setSeed, setSeed,
        next: next,
        nextDouble : nextDouble
    };

}());


for (i = 0; i < 100; i++) {
    //console.log(`${i}: ${Random.nextDouble()}`);  // For demonstrating the period
    console.log(Random.nextDouble());
}
