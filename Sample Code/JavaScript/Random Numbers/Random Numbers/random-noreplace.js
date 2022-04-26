// ------------------------------------------------------------------
//
// Demonstration of allowing a custom distribution of random numbers
// to be generated.
//
// ------------------------------------------------------------------
let Random = (function() {
    let that = {};
    let bagOfNumbers = [];
    let source = [];

    // Reference: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    function shuffle(a) {
        source = a.slice(); // Clever trick to copy an array
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }

        return a;
    }

    that.setDistribution = function(dist) {
        source.length = [];
        for (let i = 0; i < dist.length; i++) {
            for (number in dist[i]) {
                for (let count = 1; count <= dist[i][number]; count++) {
                    source.push(number);
                }
            }
        }

        bagOfNumbers = shuffle(source);
    }

    that.next = function() {
        if (bagOfNumbers.length === 0) {
            bagOfNumbers = shuffle(source);
        }
        return bagOfNumbers.pop();
    }

    Object.defineProperty(that, 'isEmpty',  {
        get() { return bagOfNumbers.length == 0; }
    });

    return that;
}());

Random.setDistribution([{1: 2}, {2: 3}, {3: 4}, {4: 5}]);

while (!Random.isEmpty) {
    console.log(Random.next());
}
