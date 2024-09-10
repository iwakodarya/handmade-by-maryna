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
    }

    galleryMenuFolders.forEach((album) => createGalleryAlbum(album));
};

const createGalleryAlbum = (albumInfo) => {
    console.log('albumInfo -->', albumInfo);
    console.log('albumInfo.coverPhotoSrc -->', albumInfo.coverPhotoSrc)
    const albumDiv = document.createElement('div');
    albumDiv.classList.add('gallery-album');
    const albumImg = document.createElement('img');
    albumImg.src = albumInfo.coverPhotoSrc;
    const albumTitle = document.createElement('p');
    albumTitle.innerHTML = albumInfo.displayName;

    albumDiv.appendChild(albumImg);
    albumDiv.appendChild(albumTitle);

    document.getElementById('gallery-menu').appendChild(albumDiv);
};

document.addEventListener('DOMContentLoaded', loadGalleryAlbums);