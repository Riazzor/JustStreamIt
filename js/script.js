"use strict";
const itemsCount = 7;

document.addEventListener('click', elem => {
    let arrow;
    if (elem.target.matches('.arrow')) {
        arrow = elem.target;
    } else {
        arrow = elem.target.closest('.arrow');
    }

    if (arrow != null) {
        onClickArrow(arrow);
    }
})

function calculateProgressBarItems(progressBar) {
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

function onClickArrow(arrow) {
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
    if (response.ok) {
        return response.json();
    }
}

async function fetchNextItems(next_url, missingNumber) {
    let fetchResponse = await fetch(next_url)
        .then(response => jsonResponse(response))
        .then(nextData => {
            return {
                'items': nextData.results,
                'nextUrl': nextData.next,
            }
        });
    let nextItems = fetchResponse.items;
    let nextUrl = fetchResponse.nextUrl;
    if (nextItems.length < missingNumber) {
        let missingItems2 = missingNumber - nextItems.length;
        let items = await fetchNextItems(nextUrl, missingItems2);
        for (let i = 0; i < missingItems2; i++) {
            nextItems.push(items[i]);
        }
    }
    return nextItems;
}

async function getCategorieList() {
    let fetchResponse = await fetch('http://127.0.0.1:8000/api/v1/genres/')
        .then(response => jsonResponse(response))
        .then(data => {
            return {
                'categories': data.results,
                'nextUrl': data.next,
                'total': data.count,
            }
        })
    let categorieList = [];
    for (let categorie of fetchResponse.categories) {
        categorieList.push(categorie.name);
    }
    let nextUrl = fetchResponse.nextUrl;
    let total = fetchResponse.total;

    if (categorieList.length < total && nextUrl != null) {
        let missingCategories = total - categorieList.length;
        let categories = await fetchNextItems(nextUrl, missingCategories);
        for (let i = 0; i < missingCategories; i++) {
            categorieList.push(categories[i].name);
        }
    }

    return categorieList;
}

async function getCategorieMovies(movieCategorie) {
    let moviesUrl;
    if (movieCategorie === 'TheBest') {
        moviesUrl = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score';
    } else {
        moviesUrl = `http://127.0.0.1:8000/api/v1/titles?genre=${movieCategorie}`;
    }
    let fetchResponse = await fetch(moviesUrl)
        .then(response => jsonResponse(response))
        .then(data => {
            return {
                'movies': data.results,
                'nextUrl': data.next,
            };
        });
    let categorieMovies = fetchResponse.movies;
    let nextUrl = fetchResponse.nextUrl;

    if (categorieMovies.length < itemsCount && nextUrl != null) {
        let missingMovies = itemsCount - categorieMovies.length;
        let movies = await fetchNextItems(nextUrl, missingMovies);
        for (let i = 0; i < missingMovies; i++) {
            categorieMovies.push(movies[i]);
        }
    }

    return categorieMovies;
}

async function getMovieDetails(movie) { }

async function setCategorieSlider(categorieName, categoryMovies) {
    let sliderBloc = document.createElement('div');
    sliderBloc.className = 'categorie';

    // First we create the categorie header (title and progress bar):
    let categorieHeader = document.createElement('div');
    let categorieTitle = document.createElement('h3');
    let progressBar = document.createElement('div');
    categorieHeader.className = 'categorie-header';
    categorieTitle.className = 'categorie-name';
    progressBar.className = 'progress-bar';
    categorieTitle.textContent = categorieName;
    categorieHeader.append(categorieTitle, progressBar);
    sliderBloc.appendChild(categorieHeader);

    // Then we create the slider container (left arrow, slider and right arrow):
    let sliderContainer = document.createElement('div');
    let slider = document.createElement('div');
    let leftArrowDiv = document.createElement('button');
    let rightArrowDiv = document.createElement('button');
    let arrowButton1 = document.createElement('div');
    let arrowButton2 = document.createElement('div');
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
        let sliderMovie = document.createElement('div');
        let sliderImage = document.createElement('img');
        let movieTitle = document.createElement('h4');
        movieTitle.className = 'movie-title';
        movieTitle.textContent = movie.title;
        sliderMovie.className = 'slider-movie';
        sliderMovie.id = movie.id;
        sliderImage.className = 'slider-image';
        sliderImage.setAttribute('src', movie.image_url);
        sliderMovie.append(sliderImage, movieTitle);

        slider.append(sliderMovie);
    }

    sliderContainer.append(leftArrowDiv);
    sliderContainer.append(slider);
    sliderContainer.append(rightArrowDiv);

    sliderBloc.append(sliderContainer);
    let mainNode = document.getElementsByTagName('main')[0];
    mainNode.append(sliderBloc);
}

async function main() {
    const categorieList = await getCategorieList();
    const randomCategories = [];
    let choosedIndexList = new Array();
    console.log(categorieList.length);
    for (let i = 0; i < 3; i++) {
        let index = Math.floor(Math.random() * categorieList.length);
        while (choosedIndexList.includes(index)) {
            index = Math.floor(Math.random() * categorieList.length);
        }
        choosedIndexList.push(index);
        randomCategories.push(categorieList[index]);
    }
    console.log(choosedIndexList);

    // Best movies ever :
    const bestMovies = await getCategorieMovies('TheBest');
    await setCategorieSlider('Meilleurs films du moment', bestMovies);

    // Categories :
    for (const categorie of randomCategories) {
        const categorieMovies = await getCategorieMovies(categorie);
        await setCategorieSlider(categorie, categorieMovies);
    }
    document.querySelectorAll('.progress-bar').forEach(calculateProgressBarItems);
}

main();
