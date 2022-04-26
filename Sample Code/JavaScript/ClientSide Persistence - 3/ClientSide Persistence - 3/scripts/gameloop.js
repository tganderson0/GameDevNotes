// ------------------------------------------------------------------
// 
// This is the game module.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------
let MyGame = {
    persistence : (function () {
        'use strict';
        let highScores = {};
        let previousScores = localStorage.getItem('MyGame.highScores');

        if (previousScores !== null) {
            highScores = JSON.parse(previousScores);
        }

        function add(key, value) {
            highScores[key] = value;
            localStorage['MyGame.highScores'] = JSON.stringify(highScores);
        }

        function remove(key) {
            delete highScores[key];
            localStorage['MyGame.highScores'] = JSON.stringify(highScores);
        }

        function report() {
            let htmlNode = document.getElementById('div-console');
            
            htmlNode.innerHTML = '';
            for (let key in highScores) {
                htmlNode.innerHTML += ('Key: ' + key + ' Value: ' + highScores[key] + '<br/>'); 
            }
            htmlNode.scrollTop = htmlNode.scrollHeight;
        }

        return {
            add : add,
            remove : remove,
            report : report
        };
    }())
};

function addValue() {
    'use strict';

    MyGame.persistence.add(
        document.getElementById('id-key').value,
        document.getElementById('id-value').value);

    MyGame.persistence.report();
}

function removeValue() {
    'use strict';

    MyGame.persistence.remove(document.getElementById('id-key').value);
    MyGame.persistence.report();
}

MyGame.persistence.report();