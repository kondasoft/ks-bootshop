/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/

// Get carousel
const carouselEl = document.getElementById('product-carousel');

// Handle product gallery active class (carousel)
if (carouselEl) {    
    carouselEl.addEventListener('slide.bs.carousel', event => {
        Array.from(carouselEl.getElementsByClassName('product-carousel-thumbnails-item')).forEach(function(el, index) {
            if (index == event.to) {
                el.classList.add('active');
                el.getElementsByTagName('img')[0]
                    .classList.add('border', 'border-secondary');
            } else {
                el.classList.remove('active');
                el.getElementsByTagName('img')[0]
                    .classList.remove('border', 'border-secondary');
            }
        });
    });
}
     
// Handle product gallery full-screen click
if (carouselEl) {
    carouselEl.querySelectorAll('.carousel-item a').forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            if (document.fullscreenEnabled) {
                carouselEl.requestFullscreen();
            }
        });
    });
}

// Close full-screen with close button
const closeFullScreenBtn = document.getElementById('close-full-screen-btn');

if (closeFullScreenBtn) {
    closeFullScreenBtn.addEventListener('click', () => {
        document.exitFullscreen();
    });
}

// Adjust product gallery based on 'fullscreenchange' event
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        carouselEl.classList
            .add('full-screen');

        carouselEl.querySelectorAll('.carousel-item')
            .forEach(item => {
                const img = item.getElementsByTagName('img')[0];
                const newImgSrc = item.getElementsByTagName('a')[0].href;
                img.src = newImgSrc;
            });

    } else {
        carouselEl.classList.remove('full-screen');

        carouselEl.querySelectorAll('.carousel-item')
            .forEach(item => {
                const img = item.getElementsByTagName('img')[0];
                img.src = img.dataset.src;
            });
    }
});

// Handle pinch zoom
// https://github.com/GoogleChromeLabs/pinch-zoom


// Stop videos on slide change
if (carouselEl) {    
    carouselEl.addEventListener('slid.bs.carousel', event => {
        Array.from(carouselEl.getElementsByClassName('carousel-item'))
            .forEach(function(el, index) {

                if (index == event.from) {
                    let iframe = el.querySelector('iframe');
                    let video = el.querySelector('video');
                    
                    if (iframe) {
                        let iframeSrc = iframe.src;
                        iframe.src = iframeSrc;
                    }
                    if (video) {
                        video.pause();
                    }
                }

            });
    });
}

// Adjust sticky-top class for carousel
if (carouselEl && carouselEl.classList.contains('sticky-top')) {
    const navbarEl      = document.querySelector('#navbar.navbar-sticky');
    let navbarHeight    = 0;

    if (navbarEl) {
        navbarHeight = navbarEl.clientHeight;
    }

    carouselEl.style.top = navbarHeight + 20 + 'px';
    carouselEl.style.zIndex = 1019;
}