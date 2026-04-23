document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        duration: 1000, // Глобальная длительность
        once: true, // Анимация запускается только один раз
    });
});

// document.addEventListener('DOMContentLoaded', () => {
//     const audio = new Audio('../audio.mp3');
//     audio.autoplay = true;
//     audio.loop = true;
//     audio.volume = 0.2;

//     const btn = document.getElementById('btn-music');

//     const playAudio = () => {
//         audio.play().catch((error) => console.log('Автовоспроизведение заблокировано: ', error));
//         document.body.removeEventListener('click', playAudio);
//         btn.classList.remove('play');
//         btn.classList.add('pause');
//     };

//     const pauseAudio = () => {
//         audio.pause();
//         btn.classList.add('play');
//         btn.classList.remove('pause');
//     };

//     btn.addEventListener('click', function () {
//         if (btn.classList.contains('play')) {
//             playAudio();
//         } else {
//             pauseAudio();
//         }
//     });

//     // Попытка воспроизведения с пользовательским взаимодействием
//     document.body.addEventListener('click', playAudio, { once: true });
// });
