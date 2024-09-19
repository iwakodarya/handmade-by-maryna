const BUCKET_NAME = 'handmade-by-maryna';
const BUCKET_URL = 'https://handmade-by-maryna.s3.us-east-2.amazonaws.com/';

const getPhotoKeysInFolder = async (prefix) => {
    AWS.config.region = 'us-east-2';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:62f94c93-d03e-4a62-bd05-ecbec4365393'
    });

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {
            Bucket: 'handmade-by-maryna'
        }
    });

    try {
        const data = await s3
            .listObjects({
                Bucket: 'handmade-by-maryna',
                Prefix: prefix
            })
            .promise();

        return data.Contents;
    } catch (err) {
        console.log(`Error fetching ${prefix} photos :: `, err);
    }
};

// Returns an image carousel made from array of photoKeys passed in
const createImageCarousel = (photoKeys, carouselId) => {
    const indicators = document.createElement('div');
    indicators.classList.add('carousel-indicators');

    const photosDiv = document.createElement('div');
    photosDiv.classList.add('carousel-inner');

    // Create indicator elements
    for (let i = 0; i < photoKeys.length; i++) {
        const indicator = document.createElement('button');
        indicator.setAttribute('type', 'button');
        indicator.setAttribute('data-bs-target', '#' + carouselId);
        indicator.setAttribute('data-bs-slide-to', i.toString());
        if (i == 0) indicator.classList.add('active');
        indicators.appendChild(indicator);
    }

    // Create photo elements
    photoKeys.forEach((photo, photoIndex) => {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('carousel-item');
        const image = document.createElement('img');
        image.className = 'd-block w-100';
        image.setAttribute('src', BUCKET_URL + photo.Key);
        imageDiv.appendChild(image);

        if (photoIndex == 0) imageDiv.classList.add('active');
        photosDiv.appendChild(imageDiv);
    });

    // Create controls
    const prevControl = document.createElement('button');
    prevControl.className = 'carousel-control-prev';
    prevControl.setAttribute('type', 'button');
    prevControl.setAttribute('data-bs-target', '#' + carouselId);
    prevControl.setAttribute('data-bs-slide', 'prev');
    prevControl.innerHTML = `
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    `;

    const nextControl = document.createElement('button');
    nextControl.className = 'carousel-control-next';
    nextControl.setAttribute('type', 'button');
    nextControl.setAttribute('data-bs-target', '#' + carouselId);
    nextControl.setAttribute('data-bs-slide', 'next');
    nextControl.innerHTML = `
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    `;

    // Create main div element for carousel with id parameter
    const carouselElement = document.createElement('div');
    carouselElement.id = carouselId;
    carouselElement.className = 'carousel slide';
    carouselElement.setAttribute('data-ride', 'carousel');
    carouselElement.appendChild(indicators);
    carouselElement.appendChild(photosDiv);
    carouselElement.appendChild(prevControl);
    carouselElement.appendChild(nextControl);

    return carouselElement;
};
