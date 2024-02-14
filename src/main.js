import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';


const input = document.querySelector("input");
const form = document.querySelector(".form")

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


form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const searchInput = input.value.trim();

    if (!searchInput) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a valid search term',
        });
        return;
    }
    showLoader();

    const config = {
        apiKey: '42337135-3774c2f446ec3f71c1b4c916a',
        baseUrl: 'https://pixabay.com/api/',
    };

    const url = `https://pixabay.com/api/?key=${config?.apiKey}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true`;


    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        updateGallery(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoader();
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while fetching data. Please try again later.',
            position: 'center',
        });
    }
});

function handleApiResponse(response) {
    hideLoader();


    if (!response || !response.hits) {
        iziToast.error({
            title: 'Error',
            message: 'Invalid response format. Please try again later.',
            position: 'center',
        });
        return;
    }

    if (response.hits.length === 0) {
        iziToast.info({
            title: 'Info',
            message: 'Sorry, there are no images matching your search query. Please try again!',
            position: 'center',
            transitionIn: "fadeInLeft",
        });
        return;
    }


    updateGallery(response);
}


function updateGallery(data) {
    const galleryContainer = document.querySelector(".gallery");
    galleryContainer.innerHTML = '';

    const lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionType: 'attr',
        captionsData: 'alt',
        captionPosition: 'bottom',
        fadeSpeed: 150,
        captionSelector: 'img',
        captionDelay: 250,
    });

    const markup = data.hits.map(data => `
        <li class="gallery-item">
            <a href="${data.largeImageURL}">
                <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}">
            </a>
            <p><b>Likes: </b>${data.likes}</p>
            <p><b>Views: </b>${data.views}</p>
            <p><b>Comments: </b>${data.comments}</p>
            <p><b>Downloads: </b>${data.downloads}</p>
        </li>`).join('');

    galleryContainer.innerHTML = markup;
    lightbox.refresh();

    // Hide the loader after updating the gallery
    hideLoader();
}