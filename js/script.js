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

document.querySelectorAll('.progress-bar').forEach(calculateProgressBarItems)

function calculateProgressBarItems(progressBar) {
    progressBar.innerHTML = '';
    const slider = progressBar.closest('.categorie').querySelector('.slider');
    const itemPerScreen = parseInt(getComputedStyle(slider).getPropertyValue('--items-per-screen'));
    const progressBarItemCount = Math.ceil(itemsCount / itemPerScreen);
    const sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue('--slider-index'));

    for (let i = 0; i < progressBarItemCount; i++) {
        const progressItem = document.createElement('div');
        progressItem.classList.add('progress-item')

        if (i === sliderIndex) {
            progressItem.classList.add('active')
        }

        progressBar.append(progressItem)
    }
}

function onClickArrow(arrow){
    const progressBar = arrow.closest('.categorie').querySelector('.progress-bar');
    const slider = arrow.closest('.container').querySelector('.slider');
    const itemPerScreen = parseInt(getComputedStyle(slider).getPropertyValue('--items-per-screen'));
    const progressBarItemCount = Math.ceil(itemsCount / itemPerScreen);
    let sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue('--slider-index'));
    if (arrow.classList.contains('left-arrow')) {
        progressBar.children[sliderIndex].classList.remove('active');
        if (sliderIndex - 1 < 0) {
            progressBar.children[progressBarItemCount - 1].classList.add('active');
            sliderIndex = progressBarItemCount - 1;
            console.log(sliderIndex);
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