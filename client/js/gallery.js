const galleryData = [
    {
        albumName: 'polymer_clay',
        displayName: 'Polymer Clay'
    },
    {
        albumName: 'felting',
        displayName: 'Felting'
    }
];

const showGalleryMenu = async () => {
    // Get album cover photos
    for (const album of galleryData) {
        // If album covers aren't cached yet, fetch them.
        if (!album.coverPhotoSrc) {
            // Get first (and only) photo from designated cover album
            const coverAlbumKey = 'gallery_cover_' + album.albumName + '/';
            const coverPhotoKeys = await getPhotoKeysInFolder(coverAlbumKey);
            album.coverPhotoSrc = BUCKET_URL + coverPhotoKeys[0].Key;
        }

        // Create album
        createGalleryAlbum(album);
    }
};

const createGalleryAlbum = (albumInfo) => {
    const albumDiv = document.createElement('div');
    albumDiv.classList.add('gallery-album');
    albumDiv.id = albumInfo.albumName;
    const albumImg = document.createElement('img');
    albumImg.src = albumInfo.coverPhotoSrc;
    const albumTitle = document.createElement('p');
    albumTitle.innerHTML = albumInfo.displayName;

    albumDiv.appendChild(albumImg);
    albumDiv.appendChild(albumTitle);

    document.getElementById('gallery-menu').appendChild(albumDiv);
};

const showBackButton = () => {
    const backButton = document.createElement('button');
    backButton.innerHTML =
        '<i class="fa-solid fa-arrow-left-long"></i>  Back to  albums';

    document.getElementById('gallery-back-button').appendChild(backButton);
};

const showGalleryAlbumHeader = (albumName) => {
    // Update title to include album name
    document.getElementById('gallery-title').innerHTML = albumName;
};

const getAlbumPhotosFromS3 = async (selectedAlbum) => {
    const galleryDataAlbum = galleryData.find(
        (album) => album.albumName === selectedAlbum
    );
    // If photoKeys aren't cached yet, fetch them.
    if (!galleryDataAlbum.photoKeys) {
        galleryDataAlbum.photoKeys = await getPhotoKeysInFolder(
            selectedAlbum + '/'
        );
        // group collages into arrays to treat them separately
        galleryDataAlbum.photoKeys = galleryDataAlbum.photoKeys
            .map((photo) => {
                if (photo.Key.includes('/single_')) return photo.Key;
                else if (photo.Key.match('collage_[a-zA-Z0-9]*_1_')) {
                    // get name key of this photo
                    const nameKey = photo.Key.match('collage_[a-zA-Z0-9]*_')[0];
                    // find other photos with this nameKey
                    const collagePhotos = galleryDataAlbum.photoKeys
                        .filter((photo) => photo.Key.includes(nameKey))
                        .map((photo) => photo.Key);
                    return collagePhotos.sort();
                }
            })
            // remove remaining photos that are part of a collage
            .filter((photo) => photo !== undefined);
    }
    return galleryDataAlbum;
};

const showAlbumPhotos = async (selectedAlbum) => {
    const galleryDataAlbum = await getAlbumPhotosFromS3(selectedAlbum);

    showGalleryAlbumHeader(galleryDataAlbum.displayName);

    for (key of galleryDataAlbum.photoKeys) {
        const photoElement = document.createElement('img');
        photoElement.src = BUCKET_URL + key;
        photoElement.classList.add('gallery-photo');
        document.getElementById('gallery-photos').appendChild(photoElement);
    }
};

const hideAlbumPhotos = () => {
    document.getElementById('gallery-photos').innerHTML = '';
};

const hideBackButton = () => {
    document.getElementById('gallery-back-button').innerHTML = '';
};

const hideGalleryMenu = () => {
    document.getElementById('gallery-menu').innerHTML = '';
};

document.addEventListener('DOMContentLoaded', () => {
    showGalleryMenu();

    // Behavior on album click
    document
        .getElementById('gallery-menu')
        .addEventListener('click', (event) => {
            if (event.target.id !== 'gallery-menu') {
                hideGalleryMenu();
                showAlbumPhotos(event.target.parentElement.id);
                showBackButton();
            }
        });

    // Behavior on "Back" button click
    document
        .getElementById('gallery-back-button')
        .addEventListener('click', (event) => {
            if (event.target.nodeName == 'BUTTON') {
                hideBackButton();
                hideAlbumPhotos();
                showGalleryMenu();
            }
        });
});
