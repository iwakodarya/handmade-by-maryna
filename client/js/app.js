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

        if (photoIndex == 0)
            imageDiv.classList.add('active');
        photosDiv.appendChild(imageDiv);
    });

    //append to DOM
    const carouselMainParent = document.getElementById('home-carousel');
    carouselMainParent.insertBefore(indicators, carouselMainParent.firstChild);
    carouselMainParent.insertBefore(
        photosDiv,
        carouselMainParent.firstChild.nextSibling
    );
};

window.addEventListener('DOMContentLoaded', loadCarousel);
