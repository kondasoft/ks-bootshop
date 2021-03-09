/* 
    © 2021 KondaSoft
    https://www.kondasoft.com
*/
const el = document.querySelector('.google-map');

if (el) {
    window.addEventListener('DOMContentLoaded', () => {

        setTimeout(() => {

            var script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${el.dataset.apiKey}&callback=initMap`;
            script.defer = true;
            script.async = true;

            window.initMap = function() {      
                const elArray = document.querySelectorAll('.google-map');

                elArray.forEach(el => {
                    const latLng = { 
                        lat: Number(el.dataset.lat), 
                        lng: Number(el.dataset.lng) 
                    };

                    const map = new google.maps.Map(el, {
                        center: latLng,
                        zoom: Number(el.dataset.zoom),
                    });

                    const marker = new google.maps.Marker({
                        position: latLng,
                        map
                    });

                    marker.addListener('click', () => {
                        el.closest('.google-map-wrapper')
                            .querySelector('.google-map-content')
                            .classList.remove('hide');
                    });
                });
            };

            document.head.appendChild(script);
        }, 500);
    });
}

// Handle close button
document.querySelectorAll('.google-map-btn-close').forEach(el => 
    el.addEventListener('click', (e) => {
        e.target.closest('.google-map-content')
            .classList.add('hide');
    })
);


// Listen for changes in Shopify Theme Editor
document.addEventListener('shopify:section:load', function (event) {
    if (document.getElementById(event.target.id).querySelector('.google-map')) {
        initMap();
    }
});