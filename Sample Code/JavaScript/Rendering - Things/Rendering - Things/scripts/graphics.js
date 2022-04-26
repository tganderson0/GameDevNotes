// IEFE
let Graphics = (function () {
    let that = {};

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    that.clear = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    that.renderTexture = function (texture) {
        if (texture.ready) {
            context.save();
            context.translate(texture.center.x, texture.center.y);
            context.rotate(texture.rotation);
            context.translate(-texture.center.x, -texture.center.y);

            context.drawImage(
                texture.image,
                texture.center.x - texture.width / 2,
                texture.center.y - texture.height / 2,
                texture.width, texture.height);

            context.restore();
        }
    };

    that.Text = function (spec) {
        let thatText = {};

        function measureText() {
            context.save();

            context.font = spec.font;
            thatText.height = context.measureText('m').width;
            thatText.width = context.measureText(spec.text).width;

            context.restore();
        }

        thatText.updateRotation = function (angle) {
            spec.rotation += angle;
        };

        thatText.draw = function () {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;
            context.textBaseline = 'top';

            context.translate(thatText.pos.x + thatText.width / 2, thatText.pos.y + thatText.height / 2);
            context.rotate(spec.rotation);
            context.translate(-(thatText.pos.x + thatText.width / 2), -(thatText.pos.y + thatText.height / 2));
            
            context.fillText(spec.text, thatText.pos.x, thatText.pos.y);
            context.strokeText(spec.text,thatText.pos.x, thatText.pos.y);
            
            context.restore();
        };

        thatText.pos = spec.pos;
        measureText();

        return thatText;
    };

    return that;
}());
