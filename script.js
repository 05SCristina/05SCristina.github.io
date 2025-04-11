let loaded = false;
let heartVisible = true;

let currentImageIndex = 0;
const phrases = [
    "Hey sapevi che il primo episodio di dr who nel '63 è stato riprodotto 80 secondi in ritardo per far spazio ad un annuncio dell'omicido di Kennedy avvenuto il giorno prima?", 
    "Negli anni '90 la polizia porto a tribunale la BBC per aver usato una cabina di polizia come TARDIS. Poi il giudice, fan della serie, fece pagare una tassa alla polizia poichè la cabina era più riconoscibile come TARDIS", 
    "Il mio sogno d'infanzia era interpretare il Dottore, ispirato dalla versione di Tom Baker. Avevo una bambola del Dottore e scrivevo temi scolastici ispirati alla serie. Sono David Tennant, e quel sogno è diventato realtà.", 
    "Viaggiare nel tempo e nello spazio è straordinario, ma niente è più speciale di guardare Doctor Who con te, condividendo ogni avventura, ogni stranezza e cavolata che fanno❤️🚀"
];

let init = function () {
    if (loaded) return;
    loaded = true;
    let mobile = window.isDevice;
    let koef = mobile ? 0.5 : 1;
    let canvas = document.getElementById('heart');
    let ctx = canvas.getContext('2d');
    let width = canvas.width = koef * innerWidth;
    let height = canvas.height = koef * innerHeight;
    let rand = Math.random;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    let heartPosition = function (rad) {
        return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
    };

    let scaleAndTranslate = function (pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    window.addEventListener('resize', function () {
        width = canvas.width = koef * innerWidth;
        height = canvas.height = koef * innerHeight;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    });

    let traceCount = mobile ? 20 : 50;
    let pointsOrigin = [];
    let i;
    let dr = mobile ? 0.3 : 0.1;
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    let heartPointsCount = pointsOrigin.length;

    let targetPoints = [];
    let pulse = function (kx, ky) {
        for (i = 0; i < pointsOrigin.length; i++) {
            targetPoints[i] = [];
            targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
            targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
        }
    };

    let e = [];
    for (i = 0; i < heartPointsCount; i++) {
        let x = rand() * width;
        let y = rand() * height;
        e[i] = {
            vx: 0,
            vy: 0,
            R: 2,
            speed: rand() + 5,
            q: ~~(rand() * heartPointsCount),
            D: 2 * (i % 2) - 1,
            force: 0.2 * rand() + 0.7,
            f: "hsla(0," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
            trace: []
        };
        for (let k = 0; k < traceCount; k++) e[i].trace[k] = { x: x, y: y };
    }

    let config = {
        traceK: 0.4,
        timeDelta: 0.01
    };

    let time = 0;
    let loop = function () {
        if (!heartVisible) return;
        let n = -Math.cos(time);
        pulse((1 + n) * .5, (1 + n) * .5);
        time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;

        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, width, height);
        for (i = e.length; i--;) {
            var u = e[i];
            var q = targetPoints[u.q];
            var dx = u.trace[0].x - q[0];
            var dy = u.trace[0].y - q[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            if (10 > length) {
                if (0.95 < rand()) {
                    u.q = ~~(rand() * heartPointsCount);
                } else {
                    if (0.99 < rand()) {
                        u.D *= -1;
                    }
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) {
                        u.q += heartPointsCount;
                    }
                }
            }
            u.vx += -dx / length * u.speed;
            u.vy += -dy / length * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;
            for (k = 0; k < u.trace.length - 1;) {
                let T = u.trace[k];
                let N = u.trace[++k];
                N.x -= config.traceK * (N.x - T.x);
                N.y -= config.traceK * (N.y - T.y);
            }
            ctx.fillStyle = u.f;
            for (k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }

        ctx.fillStyle = "rgba(255,255,255,1)";
        for (i = u.trace.length + 13; i--;) ctx.fillRect(targetPoints[i][0], targetPoints[i][1], 2, 2);

        window.requestAnimationFrame(loop, canvas);
    };

    let currentImageIndex = 0;

    function showCharacter() {
        let container = document.createElement("div");
        container.classList.add("character-container");

        let characterImg = document.createElement("img");
        characterImg.src = `${currentImageIndex + 1}.png`;
        characterImg.classList.add("character-image");

        let maxHeight = window.innerHeight * 0.8;
        characterImg.style.maxHeight = `${maxHeight}px`;
        characterImg.style.height = 'auto';

        let textBox = document.createElement("div");
        textBox.classList.add("text-box");
        textBox.innerText = phrases[currentImageIndex];
        textBox.setAttribute("id", "textBox");

        container.appendChild(characterImg);
        container.appendChild(textBox);
        document.body.appendChild(container);

        setTimeout(() => {
            container.classList.add("show");
        }, 300);

        document.addEventListener("click", function () {
            characterImg.remove();
            textBox.remove();

            currentImageIndex++;

            if (currentImageIndex >= phrases.length) {
                currentImageIndex = 0;
            }
            characterImg = document.createElement("img");
            characterImg.src = `${currentImageIndex + 1}.png`;

            characterImg.style.maxHeight = `${maxHeight}px`;
            characterImg.style.height = 'auto';

            characterImg.classList.add("character-image");

            textBox = document.createElement("div");
            textBox.classList.add("text-box");
            textBox.innerText = phrases[currentImageIndex];
            textBox.setAttribute("id", "textBox");

            container.appendChild(characterImg);
            container.appendChild(textBox);

            setTimeout(() => {
                container.classList.add("show");
            }, 300);
        });
    }
   

    setTimeout(function () {
        heartVisible = false;
        ctx.clearRect(0, 0, width, height); 
        showCharacter();

        document.body.style.backgroundImage = "url('BG.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }, 11800);

    loop();
};

let s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);
