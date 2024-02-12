import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';


const showLoader = () => {
    const loader = document.createElement('span');
    loader.classList.add('loader');
    document.body.append(loader);
};
const hideLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
};


const form = document.querySelector(".form").addEventListener('submit', function (e) {
    e.preventDefault();
    const searchInput = document.querySelector("input").value.trim();

    if (!searchInput) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a valid search term',
        });
        return;
    }
    showLoader();

    const apiKey = '42337135-3774c2f446ec3f71c1b4c916a';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true`;
    fetch(url)
        .then(response => response.json())
        .then(data => handleApiResponse(data))
        .catch(error => {
            console.error('Error fetching data:', error);
            hideLoader();
            iziToast.error({
                title: 'Error',
                message: 'An error occurred while fetching data. Please try again later.',
            });
        });
});

function handleApiResponse(response) {
    hideLoader();

    const galleryContainer = document.querySelector(".gallery");
    galleryContainer.innerHTML = '';

    if (response.hits.length === 0) {
        iziToast.info({
            title: 'Info',
            message: 'Sorry, there are no images matching your search query. Please try again!',
            position: 'center',
            transitionIn: "fadeInLeft",
        });
        return;
    }

    const lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionType: 'attr',
        captionsData: 'alt',
        captionPosition: 'bottom',
        fadeSpeed: 150,
        captionSelector: 'img',
        captionDelay: 250,
    });

    const markup = response.hits.map(data => `
        <li class="gallery-item">
            <a href="${data.largeImageURL}">
                <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}">
            </a>
            <p><b>Likes: </b>${data.likes}</p>
            <p><b>Views: </b>${data.views}</p>
            <p><b>Comments: </b>${data.comments}</p>
            <p><b>Downloads: </b>${data.downloads}</p>
        </li>`).join('');

    galleryContainer.insertAdjacentHTML('beforeend', markup);

    lightbox.on('show.simplelightbox').refresh();
}
