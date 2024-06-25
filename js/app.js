// Create gallery tiles for all the photos in the /images folder

const gallery = [
    {
        category_name: "Polymer Clay",
        id: "polymer-clay",
        folder_name: "01-polymer-clay",
        items: [
            {
                name: "bead_bracelet",
                desc: "This is a bracelet."
            },
            {
                name: "barrette1",
                desc: "This is a barrette."
            },
            {
                name: "yellow_bow",
                desc: "This is a barrette."
            },
            {
                name: "barrette2",
                desc: "This is a barrette."
            },
            {
                name: "barrette3",
                desc: "This is a barrette."
            },
            {
                name: "brown_bow",
                desc: "This is a barrette."
            },

        ]
    },
    {
        category_name: "Felting",
        id: "felting",
        folder_name: "03-felting",
        items: [
            {
                name: "felt_flowers",
                desc: "Felt flowers."
            },
            {
                name: "felt_mittens",
                desc: "Felt mittens."
            },
            {
                name: "felt_pumpkin1",
                desc: "Felt pumpkin."
            },
            {
                name: "felt_pumpkin2",
                desc: "Felt pumpkin."
            },
            {
                name: "felt_star",
                desc: "Felt star."
            },
        
        ]
    },
    {
        category_name: "Watercolor",
        id: "watercolor",
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
    // Image (in div container)
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');
    const img = document.createElement('img');
    img.setAttribute('src', imagePath);
    imgContainer.appendChild(img);
    // Desc text
    const imgDesc = document.createElement('p');
    imgDesc.innerHTML = imageDescription;

    imgTile.classList.add('gallery-image-tile');
    imgTile.appendChild(imgContainer);
    imgTile.appendChild(imgDesc);

    return imgTile;
};

function scrollSectionIntoView(sectionId) {
    const clickedSection = document.getElementById(sectionId);
    clickedSection.scrollIntoView({ behavior: "smooth" });
};

/* Get element that starts the gallery */
const galleryDiv = document.getElementById('gallery');

/* Create buttons to jump to gallery sections */
const galleryJumpButtons = document.createElement('div');
galleryJumpButtons.id = 'gallery-jump-buttons-container';
galleryDiv.appendChild(galleryJumpButtons);

gallery.forEach(
    category => {
        const categoryButton = document.createElement('p');
        categoryButton.classList.add('gallery-jump-button');
        categoryButton.innerHTML = category.category_name;
        categoryButton.id = 'nav--' + category.id;
        galleryJumpButtons.appendChild(categoryButton);
    }
);

/* Create header and gallery for each subsection, eg 'Polymer Clay' */
gallery.forEach(
    category => {
        const folderPath = category.folder_name;
        const galleryHeader = createGalleryHeader(category.category_name);
        galleryHeader.id = category.id;
        galleryDiv.appendChild(galleryHeader);
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

/* Scroll to section on nav bar click */
document.getElementById('nav-bar').addEventListener('click',
    event => {
        const sectionId = event.target.id.replace('nav--', '');
        scrollSectionIntoView(sectionId);
    }
);

/* Scroll to gallery section on click */
document.getElementById('gallery-jump-buttons-container').addEventListener('click', 
    event => {
        const sectionId = event.target.id.replace('nav--', '');
        scrollSectionIntoView(sectionId);
    }
)


