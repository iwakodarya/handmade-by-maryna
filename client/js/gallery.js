// Load gallery menu
const galleryMenuFolders = [
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
    for (const album of galleryMenuFolders) {
        const coverAlbumKey = 'gallery_cover_' + album.albumName + '/';
        // Get first (and only) photo from designated cover album
        const coverPhotoKeys = await getPhotoKeysInFolder(coverAlbumKey);
        album.coverPhotoSrc = BUCKET_URL + coverPhotoKeys[0].Key;

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

const showAlbumPhotos = async (selectedAlbum) => {
    const albumPhotoKeys = await getPhotoKeysInFolder(selectedAlbum + '/');
    for (photo of albumPhotoKeys) {
        const photoElement = document.createElement('img');
        photoElement.src = BUCKET_URL + photo.Key;
        photoElement.classList.add('gallery-photo');
        document.getElementById('gallery-photos').appendChild(photoElement);
    }
    // TO DO: hide menu, show back button, call a function to show each of the photos
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
