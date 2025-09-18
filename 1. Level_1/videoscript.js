window.onload = function() {
    speelVideos();
};



function speelVideos(shuffle = false, isIntro = true) {
    let videoLijst = JSON.parse(localStorage.getItem('videoLijst')) || [];

    const introVideo = 'inout/intro.mp4';
    const outroVideo = 'inout/outro.mp4';

    // Voeg intro en outro toe aan de lijst
    if (isIntro) {
        videoLijst = videoLijst.filter(video => video !== introVideo && video !== outroVideo);
        videoLijst.unshift(introVideo);
        videoLijst.push(outroVideo);
    } else {
        videoLijst = videoLijst.filter(video => video !== introVideo);
    }

    if (shuffle) {
        const middleVideos = videoLijst.slice(1, -1).sort(() => Math.random() - 0.5);
        videoLijst = [introVideo, ...middleVideos, outroVideo];
        localStorage.setItem('videoLijst', JSON.stringify(videoLijst));
    }

    if (videoLijst.length > 0) {
        const videoPlayer = document.getElementById('videoPlayer');
        const source = document.createElement('source');
        source.setAttribute('src', `./videos/${videoLijst[0]}`);
        source.setAttribute('type', 'video/mp4');
        console.log(source);
        videoPlayer.innerHTML = '';
        videoPlayer.appendChild(source);
        videoPlayer.load();
        videoPlayer.play();

        // Preload de volgende video
        if (videoLijst.length > 1) {
            const nextVideoPlayer = document.createElement('video');
            nextVideoPlayer.setAttribute('src', `./videos/${videoLijst[1]}`);
            nextVideoPlayer.setAttribute('type', 'video/mp4');
            nextVideoPlayer.load(); // Preload de volgende video
        }

        videoPlayer.onended = function() {
            videoLijst.shift();
            localStorage.setItem('videoLijst', JSON.stringify(videoLijst));
            if (videoLijst.length > 0) {
                speelVideos(false, false);
            } else {
                console.log("Geen video's meer om te spelen.");
            }
        };
    } else {
        console.log("Geen video's beschikbaar om te spelen.");
    }

    document.getElementById('playButton').addEventListener('click', function() {
        document.getElementById('videoPlayer').play();
    });

    document.getElementById('pauseButton').addEventListener('click', function() {
        document.getElementById('videoPlayer').pause();
    });

    document.getElementById('fullscreenButton').addEventListener('click', function() {
        document.getElementById('videoPlayer').requestFullscreen();
    });
}

document.addEventListener('wheel', function(event) {
    if (event.ctrlKey) { event.preventDefault(); }}, { passive: false });

