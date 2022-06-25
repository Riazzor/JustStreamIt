const baseURL = 'http://127.0.0.1:8000/api/v1/';
const itemsCount = 7;

function calculateProgressBarItems(progressBar) {
    // Will calculate the number of cells in the progress bar
    // according to the number of movies
    progressBar.innerHTML = '';
    const slider = progressBar.closest('.categorie').querySelector('.slider');
    const movieNumber = slider.children.length;
    const itemPerScreen = parseInt(getComputedStyle(slider)
        .getPropertyValue('--items-per-screen'));
    const progressBarItemCount = Math.ceil(movieNumber / itemPerScreen);
    const sliderIndex = parseInt(getComputedStyle(slider)
        .getPropertyValue('--slider-index'));

    for (let i = 0; i < progressBarItemCount; i++) {
        const progressItem = document.createElement('div');
        progressItem.classList.add('progress-item');

        if (i === sliderIndex) {
            progressItem.classList.add('active');
        }

        progressBar.append(progressItem);
    }
}

async function openModal(movieElement) {
    const movieId = movieElement.id;
    const movieDetails = await getMovieDetails(movieId);
    fillModal(movieDetails);
    document.getElementById('modal').style.display = 'block';
    document.body.className = 'block-scroll';
}

function closeModal(modal) {
    modal.querySelector('#movie-modal-details')
        .replaceChildren();

    modal.querySelector('#movie-modal-image')
        .src = '';

    document.body.className = '';
    modal.style.display = 'none';
}

function fillModal(movie) {
    // Fill the modal with the information of the choosed movie

    // replace empty field
    for (let detail in movie) {
        if (movie[detail] == null) {
            movie[detail] = 'N/A';
        }
    }

    const movieDetails = document.getElementById('movie-modal-details');
    const movieImage = document.getElementById('movie-modal-image');
    let currentSpan;

    const movieTitle = document.createElement('h2');
    movieTitle.className = 'movie-modal-title';
    movieTitle.textContent += `${movie.title}`;
    movieDetails.append(movieTitle);

    const movieGenre = document.createElement('div');
    movieGenre.className = 'movie-modal-genre';
    currentSpan = movieGenre.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Genres';
    movieGenre.append(
        document.createTextNode(` : ${movie.genres}`)
    );
    movieDetails.append(movieGenre);

    const movieDate = document.createElement('div');
    movieDate.className = 'movie-modal-date';
    currentSpan = movieDate.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Date';
    movieDate.append(
        document.createTextNode(` : ${movie.date_published}`)
    );
    movieDetails.append(movieDate);

    const movieNote = document.createElement('div');
    movieNote.className = 'movie-modal-note';
    currentSpan = movieNote.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Note';
    movieNote.append(
        document.createTextNode(` : ${movie.avg_vote}`)
    );
    movieDetails.append(movieNote);

    const movieNoteImdb = document.createElement('div');
    movieNoteImdb.className = 'movie-modal-imdb';
    currentSpan = movieNoteImdb.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Score imdb';
    movieNoteImdb.append(
        document.createTextNode(` : ${movie.imdb_score}`)
    );
    movieDetails.append(movieNoteImdb);

    const movieDirector = document.createElement('div');
    movieDirector.className = 'movie-modal-director';
    currentSpan = movieDirector.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Réalisateur';
    movieDirector.append(
        document.createTextNode(` : ${movie.directors}`)
    );
    movieDetails.append(movieDirector);

    const movieActors = document.createElement('div');
    movieActors.className = 'movie-modal-actors';
    currentSpan = movieActors.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Acteurs';
    movieActors.append(
        document.createTextNode(` : ${movie.actors}`)
    );
    movieDetails.append(movieActors);

    const movieDuration = document.createElement('div');
    movieDuration.className = 'movie-modal-duration';
    currentSpan = movieDuration.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Durée';
    movieDuration.append(
        document.createTextNode(` : ${movie.duration}min`)
    );
    movieDetails.append(movieDuration);

    const movieCountries = document.createElement('div');
    movieCountries.className = 'movie-modal-countries';
    currentSpan = movieCountries.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Pays';
    movieCountries.append(
        document.createTextNode(` : ${movie.countries}`)
    );
    movieDetails.append(movieCountries);

    const movieIncome = document.createElement('div');
    movieIncome.className = 'movie-modal-income';
    currentSpan = movieIncome.appendChild(
        document.createElement('span')
    );
    currentSpan.innerText = 'Résultat box office';
    movieIncome.append(
        document.createTextNode(` : ${movie.worldwide_gross_income}`)
    );
    movieDetails.append(movieIncome);

    const movieDescription = document.createElement('div');
    movieDescription.className = 'movie-modal-description';
    movieDescription.textContent += `${movie.long_description}`;
    movieDetails.append(movieDescription);

    movieImage.src = movie.image_url;

    // Now we add event on x to close modal
    document.getElementById('close-modal')
        .addEventListener('click', elem => {
            const modal = elem.target.closest('#modal');
            closeModal(modal);
        });
}

function onClickArrow(arrow) {
    // To spin the carousel by playing with the css variable --slider-index
    const categorie = arrow.closest('.categorie');
    const progressBar = categorie.querySelector('.progress-bar');
    const slider = arrow.closest('.container').querySelector('.slider');
    const progressBarItemCount = categorie.querySelector('.progress-bar').children.length//Math.ceil(itemsCount / itemPerScreen);
    let sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue('--slider-index'));

    if (progressBarItemCount === 1) {
        return;
    }
    if (arrow.classList.contains('left-arrow')) {
        progressBar.children[sliderIndex].classList.remove('active');
        if (sliderIndex - 1 < 0) {
            progressBar.children[progressBarItemCount - 1].classList.add('active');
            sliderIndex = progressBarItemCount - 1;
        } else {
            progressBar.children[sliderIndex - 1].classList.add('active');
            sliderIndex -= 1;
        }
    } else if (arrow.classList.contains('right-arrow')) {
        progressBar.children[sliderIndex].classList.remove('active');
        if (sliderIndex + 1 >= progressBarItemCount) {
            progressBar.children[0].classList.add('active');
            sliderIndex = 0;
        } else {
            progressBar.children[sliderIndex + 1].classList.add('active');
            sliderIndex += 1;
        }
    }
    slider.style.setProperty('--slider-index', sliderIndex);
}

function jsonResponse(response) {
    // fetch response needs to be a json.
    if (response.ok) {
        return response.json();
    }
}

async function fetchNextItems(next_url, missingNumber) {
    // Recursive function to be called as long as the correct
    // number of movie isn't met.
    const fetchResponse = await fetch(next_url)
        .then(response => jsonResponse(response))
        .then(nextData => {
            return {
                'items': nextData.results,
                'nextUrl': nextData.next,
            }
        });
    const nextItems = fetchResponse.items;
    const nextUrl = fetchResponse.nextUrl;
    if (nextItems.length < missingNumber) {
        const missingItems2 = missingNumber - nextItems.length;
        const items = await fetchNextItems(nextUrl, missingItems2);
        for (let i = 0; i < missingItems2; i++) {
            nextItems.push(items[i]);
        }
    }
    return nextItems;
}

async function getCategorieList() {
    // fetch every movie categorie
    const fetchResponse = await fetch(`${baseURL}genres/`)
        .then(response => jsonResponse(response))
        .then(data => {
            return {
                'categories': data.results,
                'nextUrl': data.next,
                'total': data.count,
            }
        });
    let categorieList = [];
    for (let categorie of fetchResponse.categories) {
        categorieList.push(categorie.name);
    }
    const nextUrl = fetchResponse.nextUrl;
    const total = fetchResponse.total;

    if (categorieList.length < total && nextUrl != null) {
        const missingCategories = total - categorieList.length;
        const categories = await fetchNextItems(nextUrl, missingCategories);
        for (let i = 0; i < missingCategories; i++) {
            categorieList.push(categories[i].name);
        }
    }

    return categorieList;
}

async function getCategorieMovies(movieCategorie) {
    // Get the correct number of movie to a given categorie
    let moviesUrl;
    let movieNumber;  // this variable is used to get one more film for best movies for the banner.
    if (movieCategorie === 'TheBest') {
        moviesUrl = `${baseURL}titles?sort_by=-imdb_score`;
        movieNumber = itemsCount + 1;
    } else {
        moviesUrl = `${baseURL}titles?genre=${movieCategorie}`;
        movieNumber = itemsCount;
    }
    const fetchResponse = await fetch(moviesUrl)
        .then(response => jsonResponse(response))
        .then(data => {
            return {
                'movies': data.results,
                'nextUrl': data.next,
            };
        });
    let categorieMovies = fetchResponse.movies;
    const nextUrl = fetchResponse.nextUrl;

    if (categorieMovies.length < movieNumber && nextUrl != null) {
        const missingMovies = movieNumber - categorieMovies.length;
        const movies = await fetchNextItems(nextUrl, missingMovies);
        for (let i = 0; i < missingMovies; i++) {
            categorieMovies.push(movies[i]);
        }
    }

    return categorieMovies;
}

function getMovieDetails(movieId) {
    // Dah !
    return fetch(`${baseURL}titles/${movieId}`)
        .then(response => jsonResponse(response));
}

function setBanner(movie) {
    // Set banner for the trending movie at the top of html page.
    // add event for click on button.
    const header = document.getElementsByTagName('header')[0];
    const banner = document.createElement('div');
    const movieDetails = document.createElement('div');
    const movieTitle = document.createElement('h2');
    const movieDescription = document.createElement('p');
    const bannerButton = document.createElement('button');
    const movieImage = document.createElement('img');

    banner.className = 'banner';
    movieDetails.className = 'best-movie-details';
    movieTitle.className = 'best-movie-title';
    movieDescription.className = 'best-movie-description';
    bannerButton.id = movie.id;
    bannerButton.className = 'banner-button';
    movieImage.className = 'best-movie-image';

    movieTitle.innerText = movie.title;
    movieDescription.innerText = movie.long_description;
    bannerButton.innerText = 'Info';
    movieImage.src = movie.image_url;

    movieDetails.append(movieTitle, movieDescription, bannerButton);
    banner.append(movieDetails, movieImage);
    header.append(banner);

    // Event
    bannerButton.addEventListener('click', elem => { openModal(elem.target) });
}

function setCategorieSlider(categorieName, categoryMovies) {
    // Carousel with given movies
    const sliderBloc = document.createElement('div');
    sliderBloc.className = 'categorie';

    // First we create the categorie header (title and progress bar):
    const categorieHeader = document.createElement('div');
    const categorieTitle = document.createElement('h3');
    const progressBar = document.createElement('div');
    categorieHeader.className = 'categorie-header';
    categorieTitle.className = 'categorie-name';
    progressBar.className = 'progress-bar';
    categorieTitle.innerText = categorieName;
    categorieHeader.append(categorieTitle, progressBar);
    sliderBloc.appendChild(categorieHeader);

    // Then we create the slider container (left arrow, slider and right arrow):
    const sliderContainer = document.createElement('div');
    const slider = document.createElement('div');
    const leftArrowDiv = document.createElement('button');
    const rightArrowDiv = document.createElement('button');
    const arrowButton1 = document.createElement('div');
    const arrowButton2 = document.createElement('div');
    leftArrowDiv.className = 'arrow left-arrow';
    rightArrowDiv.className = 'arrow right-arrow';
    arrowButton1.className = 'arrow-button';
    arrowButton2.className = 'arrow-button';

    leftArrowDiv.appendChild(arrowButton1);
    rightArrowDiv.appendChild(arrowButton2);

    sliderContainer.className = 'container';
    slider.className = 'slider';

    // Populating slider with movies
    for (const movie of categoryMovies) {
        const sliderMovie = document.createElement('div');
        const sliderImage = document.createElement('img');
        const movieTitle = document.createElement('h4');
        movieTitle.className = 'movie-title';
        movieTitle.innerText = movie.title;
        sliderMovie.className = 'slider-movie';
        sliderMovie.id = movie.id;
        sliderImage.className = 'slider-image';
        sliderImage.setAttribute('src', movie.image_url);
        sliderMovie.append(sliderImage, movieTitle);

        sliderMovie.addEventListener('click', elem => {
            let movieElement;
            if (elem.target.matches('.slider-movie')) {
                movieElement = elem.target;
            } else {
                movieElement = elem.target.closest('.slider-movie');
            }
            if (movieElement != null) {
                openModal(movieElement);
            }
        });

        slider.append(sliderMovie);
    }

    sliderContainer.append(leftArrowDiv);
    sliderContainer.append(slider);
    sliderContainer.append(rightArrowDiv);

    function arrowListener(elem) {
        let arrow;
        if (elem.target.matches('.arrow')) {
            arrow = elem.target;
        } else {
            arrow = elem.target.closest('.arrow');
        }

        if (arrow != null) {
            onClickArrow(arrow);
        }
    }

    leftArrowDiv.addEventListener('click', arrowListener);
    rightArrowDiv.addEventListener('click', arrowListener);

    sliderBloc.append(sliderContainer);
    const mainNode = document.getElementsByTagName('main')[0];
    mainNode.append(sliderBloc);
}

async function main() {
    const categorieList = await getCategorieList();
    const randomCategories = [];
    let choosedIndexList = [];
    for (let i = 0; i < 3; i++) {
        let index = Math.floor(Math.random() * categorieList.length);
        while (choosedIndexList.includes(index)) {
            index = Math.floor(Math.random() * categorieList.length);
        }
        choosedIndexList.push(index);
        randomCategories.push(categorieList[index]);
    }

    // Best movies ever :
    let bestMovies = await getCategorieMovies('TheBest');
    let theBestMovieEver = bestMovies.shift();
    setCategorieSlider('Meilleurs films du moment', bestMovies);

    // BANNER
    theBestMovieEver = await getMovieDetails(theBestMovieEver.id);
    setBanner(theBestMovieEver);

    // Categories :
    for (const categorie of randomCategories) {
        const categorieMovies = await getCategorieMovies(categorie);
        setCategorieSlider(categorie, categorieMovies);
    }
    document.querySelectorAll('.progress-bar').forEach(calculateProgressBarItems);
}

main();
