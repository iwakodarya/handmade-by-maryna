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
    // Re-set "Gallery" as title
    document.getElementById('gallery-title').innerHTML = 'Gallery';

    // Get album cover photos
    for (const album of galleryData) {
        // If album covers aren't cached yet, fetch them.
        if (!album.coverPhotoSrc) {
            // Get first (and only) photo from designated cover album
            const coverAlbumKey = 'gallery_cover_' + album.albumName + '/';
            const coverPhotoKeys = await getPhotoKeysInFolder(coverAlbumKey);
            album.coverPhotoSrc = BUCKET_URL + coverPhotoKeys[0];
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
            .map((key) => {
                if (key.includes('/single_')) return key;
                else if (key.match('collage_[a-zA-Z0-9]*_1_')) {
                    // get name key of this photo
                    const nameKey = key.match('collage_[a-zA-Z0-9]*_')[0];
                    // find other photos with this nameKey
                    const collagePhotos = galleryDataAlbum.photoKeys.filter(
                        (key) => key.includes(nameKey)
                    );
                    return {
                        id: nameKey,
                        photos: collagePhotos.sort()
                    };
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

    for (item of galleryDataAlbum.photoKeys) {
        const photoElement = document.createElement('div');
        const photo = document.createElement('img');

        // handle collage images
        if (typeof item === 'object') {
            photo.src = BUCKET_URL + item.photos[0];
            photo.setAttribute('data-photo-type', 'collage');
            photo.setAttribute('data-collage-id', item.id);
            photo.setAttribute('data-album', selectedAlbum);
            const numPhotosIcon = document.createElement('p');
            numPhotosIcon.classList.add('photo-count-icon');
            numPhotosIcon.innerHTML = item.photos.length;
            photoElement.appendChild(numPhotosIcon);
        } else {
            photo.src = BUCKET_URL + item;
            photo.setAttribute('data-photo-type', 'single');
        }

        // Append to DOM
        photoElement.appendChild(photo);
        photoElement.classList.add('gallery-photo');
        document.getElementById('gallery-photos').appendChild(photoElement);
    }
};

const showSinglePhotoModal = (imageSrc) => {
    const modal = document.getElementById('gallery-photo-modal');
    modal.innerHTML = `<div id="single-photo-modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${imageSrc}" class="img-fluid">
                </div>
            </div>
        </div>
    </div>`;

    const boostrapModal = new bootstrap.Modal(
        document.getElementById('single-photo-modal')
    );
    boostrapModal.show();
};

const showCollagePhotoModal = (imageSrcArray) => {
    const modal = document.getElementById('gallery-photo-modal');
    modal.innerHTML = `<div id="collage-photo-modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                </div>
            </div>
        </div>
    </div>`;

    // get the modal-body div and append a carousel of images to it
    modal
        .getElementsByClassName('modal-body')[0] // safe assumption only one such element
        .appendChild(createImageCarousel(imageSrcArray, 'collage-modal'));

    const boostrapModal = new bootstrap.Modal(
        document.getElementById('collage-photo-modal')
    );
    boostrapModal.show();
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

const hideGalleryAblumTitle = () => {
    document.getElementById('gallery-title').innerHTML = '';
};

document.addEventListener('DOMContentLoaded', () => {
    showGalleryMenu();

    // Behavior on album click
    document
        .getElementById('gallery-menu')
        .addEventListener('click', (event) => {
            if (event.target.id !== 'gallery-menu') {
                hideGalleryMenu();
                hideGalleryAblumTitle();
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
                hideGalleryAblumTitle();
                hideAlbumPhotos();
                showGalleryMenu();
            }
        });

    // Behavior on image click
    document
        .getElementById('gallery-photos')
        .addEventListener('click', (event) => {
            if (event.target.nodeName == 'IMG') {
                const photoType = event.target.getAttribute('data-photo-type');
                if (photoType === 'collage') {
                    const albumName = event.target.getAttribute('data-album');
                    const collageId =
                        event.target.getAttribute('data-collage-id');
                    const collagePhotos = galleryData
                        .find((album) => album.albumName === albumName)
                        .photoKeys.find((photo) => photo.id === collageId);
                    showCollagePhotoModal(collagePhotos.photos);
                } else showSinglePhotoModal(event.target.getAttribute('src'));
            }
        });
});
