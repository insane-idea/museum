const slider = document.querySelector(".welcome-slider-wrapper"),
    buttonPrev = slider.querySelector(".controls-slider-buttons .prev"),
    buttonNext = slider.querySelector(".controls-slider-buttons .next"),
    slideNumber = slider.querySelector(".slider-image-number"),
    slidesAmount = slider.querySelector(".slider-images-amount"),
    photos = slider.querySelectorAll(".slider-item"),
    bullets = slider.querySelectorAll(".bullet");

let currentIndex = 0,
    isEnabled = true;

function changeIndex(n) {
    currentIndex = (photos.length + n) % photos.length;
}

function updateSlidesAmount(n) {
    slidesAmount.textContent = n < 10 ? `0${n}` : `${n}`;
}

function hidePhoto(direction) {
    isEnabled = false;
    bullets[currentIndex].classList.remove("active-bullet");
    photos[currentIndex].classList.add(direction);
    photos[currentIndex].addEventListener("animationend", function () {
        this.classList.remove("active-slide", direction);
    });
}

function showPhoto(direction) {
    bullets[currentIndex].classList.add("active-bullet");
    photos[currentIndex].classList.add("next-slide", direction);
    photos[currentIndex].addEventListener("animationend", function () {
        this.classList.add("active-slide");
        this.classList.remove("next-slide", direction);
        isEnabled = true;
    });
}

function showNext(n) {
    hidePhoto("to-left");
    changeIndex(n + 1);
    slideNumber.textContent =
        photos.length < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
    showPhoto("from-right");
}

function showPrev(n) {
    hidePhoto("to-right");
    changeIndex(n - 1);
    slideNumber.textContent =
        photos.length < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
    showPhoto("from-left");
}

function updateWithBulletClick(i) {
    let newIndex;
    if (isEnabled) {
        if (i > currentIndex) {
            newIndex = i - 1;
            showNext(newIndex);
        } else if (i < currentIndex) {
            newIndex = i + 1;
            showPrev(newIndex);
        }
    }
}

function slideListener(el) {
    let elem = el,
        startX = 0,
        startY = 0,
        distX = 0,
        distY = 0;
    let startTime = 0,
        finalTime = 0;
    let minLength = 150,
        maxHeight = 100,
        maxTime = 300;

    elem.addEventListener("mousedown", function (e) {
        startX = e.pageX;
        startY = e.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
    });

    elem.addEventListener("mouseup", function (e) {
        distX = e.pageX - startX;
        distY = startY - e.pageY;
        finalTime = new Date().getTime() - startTime;
        e.preventDefault();
        if (
            Math.abs(distX) > minLength &&
            distY < maxHeight &&
            finalTime < maxTime
        ) {
            if (isEnabled) {
                if (distX < 0) {
                    showNext(currentIndex);
                } else {
                    showPrev(currentIndex);
                }
            }
        }
    });

    elem.addEventListener("touchstart", function (e) {
        let touchOffset = e.changedTouches[0];
        startX = touchOffset.pageX;
        startY = touchOffset.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
    });

    elem.addEventListener("touchend", function (e) {
        let touchOffset = e.changedTouches[0];
        distX = touchOffset.pageX - startX;
        distY = startY - touchOffset.pageY;
        finalTime = new Date().getTime() - startTime;
        e.preventDefault();
        if (
            Math.abs(distX) > minLength &&
            distY < maxHeight &&
            finalTime < maxTime
        ) {
            if (distX < 0) {
                if (isEnabled) {
                    showNext(currentIndex);
                }
            } else {
                if (isEnabled) {
                    showPrev(currentIndex);
                }
            }
        }
    });
}

updateSlidesAmount(photos.length);
slideListener(slider);
buttonNext.addEventListener("click", function () {
    if (isEnabled) {
        showNext(currentIndex);
    }
});
buttonPrev.addEventListener("click", function () {
    if (isEnabled) {
        showPrev(currentIndex);
    }
});
bullets.forEach((bullet, i) => {
    bullet.addEventListener("click", function () {
        updateWithBulletClick(i);
    });
});
