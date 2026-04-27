var DESIGN_W = 430;
var SCALE_MAX_W = 800;

function getPageScale() {
    var w = window.innerWidth;
    if (w >= SCALE_MAX_W) return 1;
    return w / DESIGN_W;
}

/* Стили из aos.css используют body[data-aos-duration] (значения в ms строкой, как в библиотеке). */
function ensureAosBodyAttrs() {
    var b = document.body;
    if (!b.getAttribute('data-aos-easing')) {
        b.setAttribute('data-aos-easing', 'ease');
    }
    if (!b.getAttribute('data-aos-duration')) {
        b.setAttribute('data-aos-duration', '1000');
    }
}

/* Нижний отступ root в px (сжимаем зону срабатывания снизу): AOS+offset+scroll ломаются с zoom, IO — нет. */
function getScrollAnimRootMargin() {
    var w = window.innerWidth;
    var h = window.innerHeight || 1;
    var ratio;
    if (w < 500) {
        ratio = 0.04;
    } else if (w < 800) {
        ratio = 0.14;
    } else {
        ratio = 0.09;
    }
    var px = Math.max(0, Math.round(h * ratio));
    return '0px 0px -' + px + 'px 0px';
}

var scrollAnimObserver;
var scrollAnimRebindT;

function rebuildScrollAnimations() {
    if (document.readyState !== 'complete' || typeof IntersectionObserver === 'undefined') {
        return;
    }
    if (scrollAnimObserver) {
        scrollAnimObserver.disconnect();
        scrollAnimObserver = null;
    }
    var rootMargin = getScrollAnimRootMargin();
    var nodes = document.querySelectorAll('[data-aos]:not(.aos-animate)');
    if (nodes.length === 0) {
        return;
    }
    scrollAnimObserver = new IntersectionObserver(
        function (entries) {
            for (var i = 0; i < entries.length; i++) {
                var e = entries[i];
                if (!e.isIntersecting) continue;
                e.target.classList.add('aos-animate');
                if (scrollAnimObserver) {
                    scrollAnimObserver.unobserve(e.target);
                }
            }
        },
        { root: null, rootMargin: rootMargin, threshold: 0.01 }
    );
    for (var j = 0; j < nodes.length; j++) {
        scrollAnimObserver.observe(nodes[j]);
    }
}

function queueScrollAnimationsRebuild() {
    if (document.readyState !== 'complete') return;
    clearTimeout(scrollAnimRebindT);
    scrollAnimRebindT = setTimeout(rebuildScrollAnimations, 100);
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
    queueScrollAnimationsRebuild();
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
    ensureAosBodyAttrs();
    applyPageScale();
    window.addEventListener('load', function () {
        applyPageScale();
    });
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
