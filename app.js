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
        }
    };

    window.addEventListener('keypress', ({ keyCode }) => {
        const KEYCODE_A = 97;
        const KEYCODE_W = 119;
        const KEYCODE_S = 115;
        const KEYCODE_D = 100;

        const MOVEMENT_DELTA = 100;

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

        if (state.player.x > gameCanvas.width - PLAYER_ICON_SIZE) {
            state.player.x = gameCanvas.width - PLAYER_ICON_SIZE;
        }

        if (state.player.y < 0) {
            state.player.y = 0;
        }

        if (state.player.y > gameCanvas.height - PLAYER_ICON_SIZE) {
            state.player.y = gameCanvas.height - PLAYER_ICON_SIZE;
        }
    }

    function updatePlayerPosition(x, y) {
        state.player.x = x;
        state.player.y = y;

        state.camera.x = x;
        state.camera.y = y;

        fixInvalidPlayerPosition();
    }
    
    const playerImage = new Image();
    playerImage.src = './player.svg';
    await new Promise(resolve => {
        playerImage.onload = resolve;
    });

    function resizeCallback() {
        const canvasWidth = document.body.clientWidth * 0.8;
        const canvasHeight = document.body.clientHeight * 0.8;

        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;

        fixInvalidPlayerPosition();
    }

    window.addEventListener('resize', resizeCallback);
    resizeCallback();
    updatePlayerPosition(gameCanvas.width / 2, gameCanvas.height / 2);

    function drawCanvas() {
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        map.objects.forEach(object => {
            context.beginPath();
            context.rect(object.x, object.y, object.w, object.h);
            context.stroke();
        });

        context.drawImage(playerImage, state.player.x, state.player.y);

        window.requestAnimationFrame(drawCanvas);
    }

    window.requestAnimationFrame(drawCanvas);

})();