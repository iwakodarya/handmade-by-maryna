// Create gallery tiles for all the photos in the /images folder

const gallery = [
    {
        category_name: "Polymer Clay",
        folder_name: "01-polymer-clay",
        items: [
            {
                name: "gold_pendant",
                desc: "This is a necklace."
            },
            {
                name: "red_brown_necklace",
                desc: "This is a necklace."
            },
            {
                name: "gold_pendant",
                desc: "This is a necklace. With a very very very very long descripton"
            },
            {
                name: "red_brown_necklace",
                desc: "This is a necklace."
            },
            {
                name: "gold_pendant",
                desc: "This is a necklace. With a very very very very long descripton"
            },
            {
                name: "red_brown_necklace",
                desc: "This is a necklace."
            },
        ]
    },
    {
        category_name: "Watercolor",
        folder_name: "02-watercolor",
        items: [
            {
                name: "golden_retriever",
                desc: "Watercolor painting of a golden retriever named Lucy."
            }
        ]
    },

]

function createGalleryHeader(name) {
    const headerName = document.createElement('h3');
    headerName.innerHTML = name;
    return headerName;
};

function createPhotoTile(imagePath, imageDescription) {
    const imgTile = document.createElement('div');
    // Image
    const img = document.createElement('img');
    img.setAttribute('src', imagePath);
    // Desc text
    const imgDesc = document.createElement('p');
    imgDesc.innerHTML = imageDescription;

    imgTile.classList.add('gallery-image-tile');
    imgTile.appendChild(img);
    imgTile.appendChild(imgDesc);

    return imgTile;
};

function scrollSectionIntoView(sectionId) {
    const clickedSection = document.getElementById(sectionId);
    clickedSection.scrollIntoView({ behavior: "smooth" });
};

const galleryDiv = document.getElementById('gallery');

gallery.forEach(
    category => {
        const folderPath = category.folder_name;
        galleryDiv.appendChild(createGalleryHeader(category.category_name));
        const galleryGrid = document.createElement('div');
        galleryGrid.classList.add('gallery');
        galleryDiv.appendChild(galleryGrid);

        category.items.forEach(
            item => {
                const photoPath = `images/${folderPath}/${item.name}.JPG`;
                galleryGrid.appendChild(createPhotoTile(photoPath, item.desc));
            }
        )
    }
);

document.getElementById('nav-bar').addEventListener('click',
    event => {
        const sectionId = event.target.id.replace('nav--', '');
        scrollSectionIntoView(sectionId);
    }
);


