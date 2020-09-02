(async () => {
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

    function updatePlayerPosition(x, y) {
        state.player.x = x;
        state.player.y = y;

        state.camera.x = x;
        state.camera.y = y;
    }
    
    const playerImage = new Image();
    playerImage.src = './player.svg';
    await new Promise(resolve => {
        playerImage.onload = resolve;
    });

    const mapResource = await fetch('./map.json');
    const map = await mapResource.json();

    const gameCanvas = document.querySelector('.game');
    const context = gameCanvas.getContext('2d');

    function resizeCallback() {
        const canvasWidth = document.body.clientWidth * 0.8;
        const canvasHeight = document.body.clientHeight * 0.8;

        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;
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