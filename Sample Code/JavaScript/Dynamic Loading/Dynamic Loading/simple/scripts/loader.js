MyGame = {
    assets: {}
};

(function initialize() {
    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest();
        let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = (fileExtension === 'txt') ? 'text' : 'blob';

            xhr.onload = function() {
                let asset = null;
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3') {
                        asset = new Audio();
                    } else if (fileExtension === 'txt') {
                        if (onSuccess) { onSuccess(xhr.responseText); }
                    }
                    else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    if (xhr.responseType === 'blob') {
                        if (fileExtension === 'mp3') {
                            asset.oncanplaythrough = function() {
                                asset.oncanplaythrough = null;  // Ugh, what a hack!
                                window.URL.revokeObjectURL(asset.src);
                                if (onSuccess) { onSuccess(asset); }
                            };
                        }
                        else {  // not terrific assumption that it has an 'onload' event, but that is what we are doing
                            asset.onload = function() {
                                window.URL.revokeObjectURL(asset.src);
                                if (onSuccess) { onSuccess(asset); }
                            };
                        }
                        asset.src = window.URL.createObjectURL(xhr.response);
                    }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
            xhr.send();
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }
    }

    //
    // Load the random.js code file
    require(
        ['random'],
        function() {        // on success
            console.log('random.js loaded');
            console.log('random number test: ', Random.nextDouble());
        },
        function(error) {   // on failure
            console.log('error: ', error);
        }
    );

    //
    // Load the fire.png asset
    loadAsset(
        '/assets/fire.png',
        function(asset) {
            console.log(`fire.png loaded: ${asset.width}, ${asset.height}`);
            console.log('asset: ', asset);
            MyGame.assets['fire'] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    //
    // Show how to load a text/data file
    loadAsset(
        '/assets/level-data.txt',
        function(asset) {
            console.log(`level-data.txt loaded`);
            console.log('asset: ', asset);
            MyGame.assets['level-data'] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );
}());
