const authorName = document.getElementById('author-name');
const birthInfo = document.querySelector('.birth-info');

const authorSchemes = [
    { background: '#0000ff', text: '#ffffff' },
    { background: '#ffff00', text: '#000000' }
];

const birthSchemes = [
    { background: '#00ff00', text: '#000000' },
    { background: '#ff00ff', text: '#ffffff' }
];

function toggleColors(element, schemes) {
    const index = element.dataset.scheme === '0' ? 1 : 0;
    element.style.backgroundColor = schemes[index].background;
    element.style.color = schemes[index].text;
    element.dataset.scheme = index;
}

authorName.addEventListener('click', () => toggleColors(authorName, authorSchemes));
birthInfo.addEventListener('click', () => toggleColors(birthInfo, birthSchemes));

const gallery = document.getElementById('gallery');
const imageSource = 'Solkan1.JPG';
const startWidth = 300;
const step = 40;
const minWidth = 80;

function getLastImage() {
    const images = gallery.querySelectorAll('img');
    return images[images.length - 1];
}

document.getElementById('add-btn').addEventListener('click', () => {
    const image = document.createElement('img');
    image.src = imageSource;
    image.alt = 'Солкан';
    image.width = startWidth;
    gallery.appendChild(image);
});

document.getElementById('enlarge-btn').addEventListener('click', () => {
    const image = getLastImage();
    if (image) {
        image.width = image.width + step;
    }
});

document.getElementById('reduce-btn').addEventListener('click', () => {
    const image = getLastImage();
    if (image) {
        image.width = Math.max(minWidth, image.width - step);
    }
});

document.getElementById('delete-btn').addEventListener('click', () => {
    const image = getLastImage();
    if (image) {
        image.remove();
    }
});