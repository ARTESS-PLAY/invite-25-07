var aosReady = false;
var DESIGN_W = 430;
var SCALE_MAX_W = 800;

function getPageScale() {
    var w = window.innerWidth;
    if (w >= SCALE_MAX_W) return 1;
    return w / DESIGN_W;
}

function applyPageScale() {
    var inner = document.getElementById('page-scaler-inner');
    if (!inner) return;
    var s = getPageScale();
    /* scale() на предке ломает mix-blend-mode; zoom — нет. */
    inner.style.transform = '';
    inner.style.marginBottom = '';
    if (s === 1) {
        inner.style.zoom = '';
    } else {
        inner.style.zoom = s;
    }
    if (aosReady && typeof AOS !== 'undefined' && AOS.refresh) {
        AOS.refresh();
    }
}

var pageScaleRaf = 0;
function schedulePageScale() {
    if (pageScaleRaf) cancelAnimationFrame(pageScaleRaf);
    pageScaleRaf = requestAnimationFrame(function () {
        pageScaleRaf = 0;
        applyPageScale();
    });
}

var pageScaleResizeT;
function onPageScaleResize() {
    clearTimeout(pageScaleResizeT);
    pageScaleResizeT = setTimeout(schedulePageScale, 100);
}

document.addEventListener('DOMContentLoaded', function () {
    applyPageScale();
    if (document.readyState === 'complete') {
        AOS.init({
            startEvent: 'DOMContentLoaded',
            duration: 1000,
            once: true,
            offset: 150,
        });
        aosReady = true;
        schedulePageScale();
    } else {
        AOS.init({
            startEvent: 'load',
            duration: 1000,
            once: true,
            offset: 150,
        });
        window.addEventListener(
            'load',
            function () {
                aosReady = true;
                schedulePageScale();
            },
            { once: true }
        );
    }

    window.addEventListener('resize', onPageScaleResize, { passive: true });

    var inner = document.getElementById('page-scaler-inner');
    if (inner && typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(function () {
            if (document.readyState === 'complete') {
                schedulePageScale();
            } else {
                applyPageScale();
            }
        }).observe(inner);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio('../audio.mp3');
    audio.autoplay = true;
    audio.loop = true;
    audio.volume = 0.2;

    const btn = document.getElementById('btn-music');

    const playAudio = () => {
        audio.play().catch((error) => console.log('Автовоспроизведение заблокировано: ', error));
        document.body.removeEventListener('click', playAudio);
        btn.classList.remove('play');
        btn.classList.add('pause');
    };

    const pauseAudio = () => {
        audio.pause();
        btn.classList.add('play');
        btn.classList.remove('pause');
    };

    btn.addEventListener('click', function () {
        if (btn.classList.contains('play')) {
            playAudio();
        } else {
            pauseAudio();
        }
    });

    // Попытка воспроизведения с пользовательским взаимодействием
    document.body.addEventListener('click', playAudio, { once: true });
});
