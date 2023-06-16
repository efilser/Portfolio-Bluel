"use strict";

// ********** CONSTANTS ********** //

const gallery = document.querySelector(".gallery");
const allFilter = document.getElementById("all");
const objectsFilter = document.getElementById("objects");
const apartmentsFilter = document.getElementById("apartments");
const hotelsResFilter = document.getElementById("hotelsRes");

// ********** VARIABLES ********** //



// ********** FUNCTIONS ********** //

/**
 * Async fetch the works array from our API.
 *
 * @return {Promise<Array>}
 */
async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

/**
 * Await the fetched array and add desired elements to the gallery when the page is loaded.
 *
 * 
 */
async function displayWorks() {
  const works = await fetchWorks();
  addWorks(works);
}

/**
 * Add desired elements of the works array to our div gallery.
 *
 * @param {Array} works
 */
function addWorks(works) {
  gallery.innerHTML = '';
  works.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    const figcaption = document.createElement('figcaption');
    figcaption.innerText = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// ********** MAIN CODE ********** //

displayWorks();

// Event Listeners
allFilter.addEventListener('click', async () => {
  const works = await fetchWorks();
  allFilter.classList.add('active');
  objectsFilter.classList.remove('active');
  apartmentsFilter.classList.remove('active');
  hotelsResFilter.classList.remove('active');
  addWorks(works);
});

objectsFilter.addEventListener('click', async () => {
  const works = await fetchWorks();
  const filteredWorks = works.filter(work => work.categoryId === 1);
  allFilter.classList.remove('active');
  objectsFilter.classList.add('active');
  apartmentsFilter.classList.remove('active');
  hotelsResFilter.classList.remove('active');
  addWorks(filteredWorks);
});

apartmentsFilter.addEventListener('click', async () => {
  const works = await fetchWorks();
  const filteredWorks = works.filter(work => work.categoryId === 2);
  allFilter.classList.remove('active');
  objectsFilter.classList.remove('active');
  apartmentsFilter.classList.add('active');
  hotelsResFilter.classList.remove('active');
  addWorks(filteredWorks);
});

hotelsResFilter.addEventListener('click', async () => {
  const works = await fetchWorks();
  const filteredWorks = works.filter(work => work.categoryId === 3);
  allFilter.classList.remove('active');
  objectsFilter.classList.remove('active');
  apartmentsFilter.classList.remove('active');
  hotelsResFilter.classList.add('active');
  addWorks(filteredWorks);
});