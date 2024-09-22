window.addEventListener('DOMContentLoaded', async () => {
    const carouselPhotosList = await getPhotoKeysInFolder('home_carousel/');
    const carousel = createImageCarousel(carouselPhotosList, 'home-carousel');
    document.getElementById('content').appendChild(carousel);
});
