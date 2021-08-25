const resultsContainer = document.querySelector('.results-container');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const resultsFilter = document.querySelector('.results-filter');
const resultsFilterItems = document.querySelectorAll('.results-filter-item');
const btnMenu = document.querySelector('.btn-menu');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');
const modalContentResult = document.querySelector('.modal-content-result');

let resultsItems;
let items = [];
let newItems = [];

resultsFilterItems.forEach((item) => {
    let check = item.lastElementChild;
    let target = item.firstElementChild.innerText;

    check.addEventListener('click', () => {
        let checked = item.lastElementChild.checked;

        if (checked) {
            items.forEach((item) => {
                if (item.title && item.ingredients.includes(target)) {
                    newItems.push(item);
                }
            });
        }

        displayItems(newItems);
    });
});

window.addEventListener('scroll', () => {
    let search = document.querySelector('.search-block');

    search.classList.toggle('sticky', window.scrollY > 200);
});

function removeClassShow() {
    modal.classList.remove('show');
    overlay.classList.remove('show');
}

function addClassShow() {
    modal.classList.add('show');
    overlay.classList.add('show');
}

closeModal.addEventListener('click', removeClassShow);
overlay.addEventListener('click', removeClassShow);

btnMenu.addEventListener('click', () => {
    btnMenu.classList.toggle('opened');
    resultsFilter.classList.toggle('opened');
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchString = searchInput.value.toLowerCase();

    const filteredItems = items.filter((item) => {
        if (item.title) {
            return item.title.toLowerCase().includes(searchString);
        }
    });

    displayItems(filteredItems);
});

const displayItems = (items) => {
    const htmlString = items
        .map((item) => {
            if (item.title) {
                return `
                <div class="results-item">
                    <div class="results-item-icon">
                        <img
                            src="dist/assets/img/coffee-icon.png"
                            alt="Ícone de xícara de café"
                        />
                    </div>
                    <div class="results-item-title">${item.title}</div>
                </div>
            `;
            }
        })
        .join('');

    resultsContainer.innerHTML = htmlString;

    resultsItems = document.querySelectorAll('.results-item');

    resultsItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            addClassShow();

            const target =
                e.currentTarget.lastElementChild.innerText.toLowerCase();

            items.forEach((item) => {
                if (item.title) {
                    if (item.title.toLowerCase() === target) {
                        modalContentResult.innerHTML = `
                            <div class="modal-item">
                                <h5 class="modal-item-title">Tipo:</h5>
                                <p class="results-item-title">${item.title}</p>
                            </div>
                            <div class="modal-item">
                                <h5 class="modal-item-title">Descrição:</h5>
                                <p class="results-item-description">
                                ${item.description}
                                </p>
                            </div>
                            <div class="modal-item">
                                <h5 class="modal-item-title">Ingredientes:</h5>
                                <p class="results-item-ingredients">${item.ingredients}</p>
                            </div>
                        `;
                    }
                }
            });
        });
    });
};

const fetchItems = async () => {
    const url = 'https://api.sampleapis.com/coffee/hot';

    try {
        const response = await fetch(url);
        items = await response.json();

        displayItems(items);
    } catch (err) {
        console.error(err);
    }
};

fetchItems();
