const player = document.querySelector(".video-block-main");
const video = player.querySelector(".player-video");
const ranges = player.querySelectorAll(".range");
const progress = player.querySelector(".length-range");
const volumeRange = player.querySelector(".volume-range");
const playButtonCenter = player.querySelector(".play-button-center");
const playButtonBottom = player.querySelector(".play-button-bottom");
const skipButtons = player.querySelectorAll("[data-skip]");
const skipBack = player.querySelector(".backward-winding-button");
const skipForward = player.querySelector(".forward-winding-button");
const fullScreenButton = player.querySelector(".full-screen-button");
const volumeButton = player.querySelector(".volume-button");
const videoControlPanel = player.querySelector(".video-control-container");
let savedVolumeValue = 0;

function playVideo() {
    if (video.paused) {
        video.play();
        playButtonCenter.style.opacity = "-1";
    } else {
        video.pause();
        playButtonCenter.style.opacity = "1";
    }
}

function hideControl() {
    const flag = video.paused ? "1" : "-1";
    videoControlPanel.style.opacity = flag;
}

function showControl() {
    if (!video.paused) {
        videoControlPanel.style.opacity = "1";
    }
}

function changePlayButton() {
    const icon = this.paused
        ? "url('./assets/svg/play-button-bottom.svg')"
        : "url('./assets/svg/pause-button-bottom.svg')";
    playButtonBottom.style.backgroundImage = icon;
    playButtonBottom.style.transition = "0s";
}

function skipPlayTime() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function updateRanges() {
    video[this.name] = this.value;
}

function updateProgress() {
    let currPercent = video.currentTime / video.duration;
    progress.value = currPercent;
}

function scrub(e) {
    let rangeShift = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = rangeShift;
}

function changeVolume(e) {
    let volumeShift = e.offsetX / volumeRange.offsetWidth;
    let bg =
        volumeShift >= 0.07
            ? "url('./assets/svg/volume-button.svg')"
            : "url('./assets/svg/volume-muted-button.svg')";

    if (volumeShift >= 1) {
        volumeShift = 1;
        volumeRange.value = volumeShift;
        volumeButton.style.backgroundImage = bg;
    } else if (volumeShift < 1 && volumeShift > 0.07) {
        volumeRange.value = volumeShift;
        volumeButton.style.backgroundImage = bg;
        volumeButton.animationTime = "0s";
    } else {
        volumeShift = 0;
        volumeRange.value = volumeShift;
        volumeButton.style.backgroundImage = bg;
        volumeButton.animationTime = "0s";
    }
}

function muteVideo() {
    let volumeRangeValue = volumeRange.value;
    const mutedBg = "url('./assets/svg/volume-muted-button.svg')";
    const volumeBg = "url('./assets/svg/volume-button.svg')";

    if (volumeRangeValue >= 0.07) {
        volumeRange.value = 0;
        video.volume = 0;
        savedVolumeValue = volumeRangeValue;
        volumeButton.style.backgroundImage = mutedBg;
    } else if (volumeRangeValue == 0) {
        if (savedVolumeValue <= 0) {
            volumeRange.value = 0.5;
            video.volume = 0.5;
            savedVolumeValue = 0;
            volumeButton.style.backgroundImage = volumeBg;
        } else {
            volumeRange.value = savedVolumeValue;
            video.volume = savedVolumeValue;
            savedVolumeValue = 0;
            volumeButton.style.backgroundImage = volumeBg;
        }
    }
}

function fullscreen() {
    var isInFullScreen =
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
            document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
            document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    if (!isInFullScreen) {
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.mozRequestFullScreen) {
            player.mozRequestFullScreen();
        } else if (player.webkitRequestFullScreen) {
            player.webkitRequestFullScreen();
        } else if (player.msRequestFullscreen) {
            player.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function detectKey(e) {
    if (e.keyCode == 32) {
        e.preventDefault();
        playVideo();
        changePlayButton();
    } else if (e.keyCode == 77) {
        e.preventDefault();
        muteVideo(e);
    } else if (e.keyCode == 70) {
        e.preventDefault();
        fullscreen();
    } else if (e.keyCode == 188 && e.shiftKey) {
        skipPlayTime.call(skipBack);
    } else if (e.keyCode == 190 && e.shiftKey) {
        skipPlayTime.call(skipForward);
    }
}

player.addEventListener("play", hideControl);
player.addEventListener("pause", hideControl);
player.addEventListener("mouseleave", hideControl);
player.addEventListener("mouseover", showControl);
video.addEventListener("pause", showControl);

video.addEventListener("click", playVideo);
video.addEventListener("play", changePlayButton);
video.addEventListener("pause", changePlayButton);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("ended", () => (video.currentTime = 0));

playButtonCenter.addEventListener("click", playVideo);
playButtonBottom.addEventListener("click", playVideo);
skipButtons.forEach((button) => button.addEventListener("click", skipPlayTime));
ranges.forEach((range) => range.addEventListener("change", updateRanges));
ranges.forEach((range) => range.addEventListener("mousemove", updateRanges));

let mousedown = false;

progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

volumeRange.addEventListener("click", changeVolume);
volumeRange.addEventListener("mousemove", (e) => mousedown && changeVolume(e));
volumeRange.addEventListener("mousedown", () => (mousedown = true));
volumeRange.addEventListener("mouseup", () => (mousedown = false));

fullScreenButton.addEventListener("click", fullscreen);
volumeButton.addEventListener("click", muteVideo);
document.addEventListener("keydown", (e) => detectKey(e));
