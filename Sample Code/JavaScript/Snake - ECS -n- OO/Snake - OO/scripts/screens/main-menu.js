MyGame.screens['main-menu'] = (function(manager) {
    'use strict';
    
    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() {manager.showScreen('game-play'); });
        
        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() { manager.showScreen('high-scores'); });
        
        document.getElementById('id-help').addEventListener(
            'click',
            function() { manager.showScreen('help'); });
        
        document.getElementById('id-about').addEventListener(
            'click',
            function() { manager.showScreen('about'); });
    }
    
    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.manager));
