
// Create the carousel component
const loadCarousel = async () => {
    const indicators = document.createElement('ol');
    indicators.classList.add('carousel-indicators');

    const photosDiv = document.createElement('div');
    photosDiv.classList.add('carousel-inner');

    const bucketHref = 'https://handmade-by-maryna.s3.us-east-2.amazonaws.com/';
    const carouselPhotosList = await getPhotoKeysInFolder('home_carousel/');

    // Create indicator elements
    for (let i = 0; i < carouselPhotosList.length; i++) {
        const indicator = document.createElement('li');
        indicator.setAttribute('data-target', '#home-carousel');
        indicator.setAttribute('data-slide-to', i.toString());
        if (i == 0) indicator.classList.add('active');
        indicators.appendChild(indicator);
    }

    // Create photo elements
    carouselPhotosList.forEach((photo, photoIndex) => {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('carousel-item');
        const image = document.createElement('img');
        image.className = 'd-block w-100';
        image.setAttribute('src', bucketHref + photo.Key);
        imageDiv.appendChild(image);

        if (photoIndex == 0) imageDiv.classList.add('active');
        photosDiv.appendChild(imageDiv);
    });

    // Create controls
    const prevControl = document.createElement('a');
    prevControl.className = 'carousel-control-prev';
    prevControl.href = `#home-carousel`;
    prevControl.setAttribute('role', 'button');
    prevControl.setAttribute('data-slide', 'prev');
    prevControl.innerHTML = `
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
    `;

    const nextControl = document.createElement('a');
    nextControl.className = 'carousel-control-next';
    nextControl.href = `#home-carousel`;
    nextControl.setAttribute('role', 'button');
    nextControl.setAttribute('data-slide', 'next');
    nextControl.innerHTML = `
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
    `;

    //append to DOM
    const carouselMainParent = document.getElementById('home-carousel');
    carouselMainParent.appendChild(indicators);
    carouselMainParent.appendChild(photosDiv);
    carouselMainParent.appendChild(prevControl);
    carouselMainParent.appendChild(nextControl);
};

window.addEventListener('DOMContentLoaded', loadCarousel);
