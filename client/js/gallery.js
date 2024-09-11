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

const loadGalleryAlbums = async () => {
    // Get album cover photos
    for (const album of galleryMenuFolders) {
        const baseS3URL =
            'https://handmade-by-maryna.s3.us-east-2.amazonaws.com/';
        const coverAlbumKey = 'gallery_cover_' + album.albumName + '/';
        // Get first (and only) photo from designated cover album
        const coverPhotoKeys = await getPhotoKeysInFolder(coverAlbumKey);
        album.coverPhotoSrc = baseS3URL + coverPhotoKeys[0].Key;

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
    console.log(albumPhotoKeys);
    // TO DO: hide menu, show back button, call a function to show each of the photos
};


document.addEventListener('DOMContentLoaded', () => {
    loadGalleryAlbums();

    // Behavior on album click
    // TO DO fix problem when user clicks outside of album (if statement?)
    document
        .getElementById('gallery-menu')
        .addEventListener('click', (event) => {
            showAlbumPhotos(event.target.parentElement.id);
        });
    
    // Behavior on "Back" button click
});


