var GameGlobal = getApp().GameGlobal;
exports.adapt = function (canvas, width, height) {
    GameGlobal.canvas = canvas;
    GameGlobal.WXWebAssembly = WXWebAssembly;
    GameGlobal.requestAnimationFrame = GameGlobal.canvas.requestAnimationFrame || globalThis.setTimeout;
    GameGlobal.cancelAnimationFrame = GameGlobal.canvas.cancelAnimationFrame || globalThis.setTimeout;
    GameGlobal.setTimeout = globalThis.setTimeout;
    GameGlobal.setInterval = globalThis.setInterval;
    GameGlobal.clearTimeout = globalThis.clearTimeout;
    GameGlobal.clearInterval = globalThis.clearInterval;

    let isFirstCall = true;

    wx.createCanvas = function () {
        console.log('wx.createCanvas called');
        if (isFirstCall) {
            isFirstCall = false;
            return canvas;
        } else {
            return wx.createOffscreenCanvas(width, height);
        }
    }

    wx.createImage = function () {
        console.log('wx.creatImage in miniapp-adapter')
        let image = canvas.createImage();
        return image;
    }

    wx.onTouchStart = function (cb) {
        GameGlobal._touchStart = function (event) {
            handleTouchEvent(event);
            cb(event);
        };
    };
    wx.onTouchMove = function (cb) {
        GameGlobal._touchMove = function (event) {
            handleTouchEvent(event);
            cb(event);
        };
    };
    wx.onTouchEnd = function (cb) {
        GameGlobal._touchEnd = function (event) {
            handleTouchEvent(event);
            cb(event);
        };
    };
    wx.onTouchCancel = function (cb) {
        GameGlobal._touchCancel = function (event) {
            handleTouchEvent(event);
            cb(event);
        };
    };

    function handleTouchEvent (event) {
        let changedTouches = event.changedTouches;
        if (changedTouches) {
            for (let touch of changedTouches) {
                touch.clientX = touch.x;
                touch.clientY = touch.y;
            }
        }
    }

    //TODO: use wx.onDeviceMotionChange to instead
    wx.onDeviceOrientationChange = function () {
    }
};
