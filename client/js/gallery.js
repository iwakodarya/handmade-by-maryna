// Load gallery menu
const galleryMenuFolders = [
    {
        folderPath: 'polymer_clay/',
        displayName: 'Polymer Clay',
        coverPhotoKey: 'https://handmade-by-maryna.s3.us-east-2.amazonaws.com/home_carousel/single_AA8nhe7TtnNinyUedbvDsn1hVoRKNM2v2ZaXyEX-udlD83fMsWrRH1ZPh6L3cClnNfVbbK3OC_hr29ut137BOxooujsWhE5eXA.jpeg'
    },
    {
        folderPath: 'felting/',
        displayName: 'Felting',
        coverPhotoKey: 'https://handmade-by-maryna.s3.us-east-2.amazonaws.com/home_carousel/single_AA8nhe6YswF68wFKyj_jwKJWvbWuOEv3dgz9qWyGaDW-Cd5hmXxgSnA5l5XZUXeNc_hWFjenSWi0YrTGmdhuV7Q8eJk12yRGzg.jpeg'
    }
];

const createGalleryAlbum = (albumInfo) => {
    const albumDiv = document.createElement('div');
    albumDiv.classList.add('gallery-album');
    const albumImg = document.createElement('img');
    albumImg.src = albumInfo.coverPhotoKey;
    const albumTitle = document.createElement('p');
    albumTitle.innerHTML = albumInfo.displayName;

    albumDiv.appendChild(albumImg);
    albumDiv.appendChild(albumTitle);

    document.getElementById('gallery-menu').appendChild(albumDiv);
};

document.addEventListener('DOMContentLoaded', () => {
    galleryMenuFolders.forEach((album) => createGalleryAlbum(album));
});
