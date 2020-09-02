(async () => {
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

    function drawCanvas() {
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        map.objects.forEach(object => {
            context.beginPath();
            context.rect(object.x, object.y, object.w, object.h);
            context.stroke();
        });

        window.requestAnimationFrame(drawCanvas);
    }

    window.requestAnimationFrame(drawCanvas);

})();