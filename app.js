(async () => {
    const mapResource = await fetch('./map.json');
    const map = await mapResource.json();

    const gameCanvas = document.querySelector('.game');
    const context = gameCanvas.getContext('2d');

    const state = {
        camera: {
            x: 0,
            y: 0
        },
        player: {
            x: 0,
            y: 0
        },
        map: {
            w: 0,
            h: 0
        },
        objects: 0,
        keys: {
            a: false,
            w: false,
            s: false,
            d: false
        }
    };

    function loadImage(path) {
        const image = new Image();
        image.src = path;

        return new Promise(resolve => {
            image.onload = () => resolve(image);
        });
    }

    const aKeyImage = await loadImage('./a-key.png');
    const wKeyImage = await loadImage('./w-key.png');
    const sKeyImage = await loadImage('./s-key.png');
    const dKeyImage = await loadImage('./d-key.png');

    window.addEventListener('keydown', ({ key }) => {
        if (key === 'a') {
            state.keys.a = true;
        }

        if (key === 'w') {
            state.keys.w = true;
        }

        if (key === 's') {
            state.keys.s = true;
        }

        if (key === 'd') {
            state.keys.d = true;
        }
    });

    window.addEventListener('keyup', ({ key }) => {
        if (key === 'a') {
            state.keys.a = false;
        }

        if (key === 'w') {
            state.keys.w = false;
        }

        if (key === 's') {
            state.keys.s = false;
        }

        if (key === 'd') {
            state.keys.d = false;
        }
    });

    window.addEventListener('keypress', ({ keyCode }) => {
        const KEYCODE_A = 97;
        const KEYCODE_W = 119;
        const KEYCODE_S = 115;
        const KEYCODE_D = 100;

        const MOVEMENT_DELTA = 50;

        if (keyCode === KEYCODE_A) {
            updatePlayerPosition(state.player.x - MOVEMENT_DELTA, state.player.y);
        }

        if (keyCode === KEYCODE_W) {
            updatePlayerPosition(state.player.x, state.player.y - MOVEMENT_DELTA);
        }

        if (keyCode === KEYCODE_S) {
            updatePlayerPosition(state.player.x, state.player.y + MOVEMENT_DELTA);
        }

        if (keyCode === KEYCODE_D) {
            updatePlayerPosition(state.player.x + MOVEMENT_DELTA, state.player.y);
        }
    });

    function fixInvalidPlayerPosition() {
        const PLAYER_ICON_SIZE = 50;

        if (state.player.x < 0) {
            state.player.x = 0;
        }

        if (state.player.x > state.map.w - PLAYER_ICON_SIZE) {
            state.player.x = state.map.w - PLAYER_ICON_SIZE;
        }

        if (state.player.y < 0) {
            state.player.y = 0;
        }

        if (state.player.y > state.map.h - PLAYER_ICON_SIZE) {
            state.player.y = state.map.h - PLAYER_ICON_SIZE;
        }
    }

    function updatePlayerPosition(x, y) {
        state.player.x = x;
        state.player.y = y;

        state.camera.x = gameCanvas.width / 2;
        state.camera.y = gameCanvas.height / 2;

        fixInvalidPlayerPosition();
    }

    function resizeCallback() {
        const canvasWidth = Math.round(document.body.clientWidth * 0.8);
        const canvasHeight = Math.round(document.body.clientHeight * 0.8);

        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;

        fixInvalidPlayerPosition();

        const objectsRightBorders = map.objects.map(object => object.x + object.w);
        const objectsBottomBorders = map.objects.map(object => object.y + object.h);
        state.map.w = Math.max(canvasWidth, ...objectsRightBorders);
        state.map.h = Math.max(canvasHeight, ...objectsBottomBorders);
    }

    window.addEventListener('resize', resizeCallback);
    resizeCallback();
    updatePlayerPosition(gameCanvas.width / 2, gameCanvas.height / 2);

    function drawCanvas() {
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        const displayedObjects = map.objects
            .filter(object => {
                const visibleMap = {
                    left: Math.max((state.player.x - gameCanvas.width / 2), 0),
                    right: Math.min((state.player.x + gameCanvas.width / 2), state.map.w),
                    top: Math.max((state.player.y - gameCanvas.height / 2), 0),
                    bottom: Math.min((state.player.y + gameCanvas.height / 2), state.map.h)
                };

                return ((object.x > visibleMap.left) && (object.x < visibleMap.right)) ||
                    (((object.x + object.w) > visibleMap.left) && ((object.x + object.w) < visibleMap.right)) || 
                    ((object.y > visibleMap.top) && (object.y < visibleMap.bottom)) ||
                    (((object.y + object.h) > visibleMap.top) && ((object.y + object.y) < visibleMap.bottom))
            });

            state.objects = displayedObjects.length;

            displayedObjects.forEach(object => {
                const deltaX = state.player.x - gameCanvas.width / 2;
                const deltaY = state.player.y - gameCanvas.height / 2;
                context.beginPath();
                context.rect(object.x - deltaX, object.y - deltaY, object.w, object.h);
                context.stroke();
            });

        context.font = '20px Arial';
        context.fillStyle = 'green';
        context.fillText(`player [ ${state.player.x}, ${state.player.y} ]`, 10, 20);
        context.fillStyle = 'purple';
        context.fillText(`camera [ ${state.camera.x}, ${state.camera.y} ]`, 250, 20);
        context.fillStyle = 'red';
        context.fillText(`map-w: ${state.map.w}, map-h: ${state.map.h}`, 500, 20);
        context.fillStyle = 'blue';
        context.fillText(`objects: ${state.objects}`, 800, 20);

        context.drawImage(wKeyImage, gameCanvas.width - 150, 20, 50, 50);
        context.drawImage(sKeyImage, gameCanvas.width - 150, 60, 50, 50);
        context.drawImage(aKeyImage, gameCanvas.width - 190, 60, 50, 50);
        context.drawImage(dKeyImage, gameCanvas.width - 110, 60, 50, 50);

        if (state.keys.w) {
            context.beginPath();
            context.rect(gameCanvas.width - 150, 20, 50, 50);
            context.stroke();
        }

        if (state.keys.s) {
            context.beginPath();
            context.rect(gameCanvas.width - 150, 60, 50, 50);
            context.stroke();
        }

        if (state.keys.a) {
            context.beginPath();
            context.rect(gameCanvas.width - 190, 60, 50, 50);
            context.stroke();
        }

        if (state.keys.d) {
            context.beginPath();
            context.rect(gameCanvas.width - 110, 60, 50, 50);
            context.stroke();
        }

        window.requestAnimationFrame(drawCanvas);
    }

    window.requestAnimationFrame(drawCanvas);

})();