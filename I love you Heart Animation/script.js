     const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');

    let width, height, viewScale;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        viewScale = Math.min(width, height) / 500;
    }
    window.addEventListener('resize', resize);
    resize();

    let points = [];
    let currentScale = 11;
    let i = 0;

    function generatePoints() {
        if (currentScale > 16) return;

        let angle = i * (Math.PI * 2) / 90;

        let x = 16 * Math.pow(Math.sin(angle), 3) * currentScale;
        let y = (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * currentScale;

        for (let zOffset = -12; zOffset <= 12; zOffset += 12) {
            points.push({
                origX: x,
                origY: y,
                origZ: zOffset,
                text: "Shahrizoda"
            });
        }

        i++;
        if (i >= 90) {
            i = 0;
            currentScale++;
        }

        setTimeout(generatePoints, 70);
    }

    let time = 0;

    // 2. High-Speed 3D Render Loop
    function render3D() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        time += 0.01;

        let angleY = time * 1.2;
        let angleX = Math.sin(time * 0.4) * 0.25;

        let cosY = Math.cos(angleY);
        let sinY = Math.sin(angleY);
        let cosX = Math.cos(angleX);
        let sinX = Math.sin(angleX);

        let projectedPoints = [];

        for (let p of points) {
            let x1 = p.origX * cosY - p.origZ * sinY;
            let z1 = p.origX * sinY + p.origZ * cosY;
            let y1 = p.origY;

            let y2 = y1 * cosX - z1 * sinX;
            let z2 = y1 * sinX + z1 * cosX;

            projectedPoints.push({
                x: x1,
                y: y2,
                z: z2,
                text: p.text
            });
        }

        projectedPoints.sort((a, b) => b.z - a.z);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let p of projectedPoints) {
            let zOffset = 400;
            let perspective = zOffset / (zOffset + p.z);

            let drawX = width / 2 + p.x * viewScale * perspective;
            let drawY = height / 2 - p.y * viewScale * perspective;

            let lightness = 85 - (p.z / 40) * 25;

            // OPTIMIZATION 3: Round values so the browser doesn't struggle caching font/colors
            lightness = Math.max(30, Math.min(100, Math.round(lightness)));
            ctx.fillStyle = `hsl(351, 100%, ${lightness}%)`;

            let fontSize = (8.5 * viewScale * perspective).toFixed(1);
            ctx.font = `bold ${fontSize}px Arial`;

            ctx.fillText(p.text, drawX, drawY);
        }

        requestAnimationFrame(render3D);
    }

    setTimeout(generatePoints, 500);
    render3D();
