"use strict";

// ********** CONSTANTS ********** //

const gallery = document.querySelector(".gallery");
const allFilter = document.getElementById("all");
const objectsFilter = document.getElementById("objects");
const apartmentsFilter = document.getElementById("apartments");
const hotelsResFilter = document.getElementById("hotelsRes");

// ********** VARIABLES ********** //

let works = [];

// ********** FUNCTIONS ********** //

/**
 * Async fetch the works array from our API.
 *
 * @return {Promise<Array>}
 */
async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();
}

/**
 * Add desired elements of the works array to our div gallery.
 *
 * @param {Array} works
 */
function addWorks(works) {
  gallery.innerHTML = '';

  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.innerText = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

/**
 * Displays the admin page.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function displayAdminPage() {
  const authElt = document.querySelector('[href="login.html"]');
  authElt.innerText = "logout";
  authElt.setAttribute("href", "#");
  authElt.addEventListener("click", (event) => { 
    event.preventDefault();
    localStorage.removeItem("token") && localStorage.removeItem("userId");
    authElt.innerText = "login";
    authElt.setAttribute("href", "login.html");
    bodyBanner.remove();
    editBanner.remove();
    publishChanges.remove();
    editImg.remove();
    editArticle.remove();
    editGallery.remove();
    alert ("Vous êtes déconnecté");
  });

  const body = document.querySelector("body");
  const bodyBanner = document.createElement('div');
  const editBanner = document.createElement('button');
  editBanner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
  editBanner.classList.add("btn-1");
  const publishChanges = document.createElement('button');
  publishChanges.innerText = "publier les changements";
  publishChanges.classList.add("btn-2");
  body.insertBefore(bodyBanner, body.firstChild);
  bodyBanner.appendChild(editBanner);
  bodyBanner.appendChild(publishChanges);

  const introImg = document.querySelector('#introduction figure');
  const editImg = document.createElement('button');
  editImg.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  editImg.classList.add("btn-3");
  introImg.appendChild(editImg);


  const introArticle = document.querySelector('#introduction article');
  const editArticle = document.createElement('button');
  editArticle.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  editArticle.classList.add("btn-4");
  introArticle.insertBefore(editArticle, introArticle.firstChild);

  const portfolioGallery = document.querySelector('#portfolio h2');
  const editGallery = document.createElement('button');
  editGallery.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  editGallery.classList.add("btn-5");
  portfolioGallery.insertAdjacentElement('afterend', editGallery);
}

/**
 * Removes the "active" class from objectsFilter, apartmentsFilter and hotelsResFilter, and add it to the allFilter.
 *
 *
 */
function filterAllWorks() {
  allFilter.classList.add("active");
  objectsFilter.classList.remove("active");
  apartmentsFilter.classList.remove("active");
  hotelsResFilter.classList.remove("active");
}

/**
 * Removes the "active" class from allFilter, apartmentsFilter and hotelsResFilter, and add it to the objectsFilter.
 *
 *
 */
function filterObjectsWorks() {
  allFilter.classList.remove("active");
  objectsFilter.classList.add("active");
  apartmentsFilter.classList.remove("active");
  hotelsResFilter.classList.remove("active");
}

/**
 * Removes the "active" class from allFilter, objectsFilter and hotelsResFilter, and add it to apartmentsFilter.
 *
 *
 */
function filterApartmentsWorks() {
  allFilter.classList.remove("active");
  objectsFilter.classList.remove("active");
  apartmentsFilter.classList.add("active");
  hotelsResFilter.classList.remove("active");
}

/**
 * Removes the "active" class from allFilter, objectsFilter and apartmentsFilter, and add it to hotelsResFilter.
 *
 *
 */
function filterHotelsResWorks() {
  allFilter.classList.remove("active");
  objectsFilter.classList.remove("active");
  apartmentsFilter.classList.remove("active");
  hotelsResFilter.classList.add("active");
}

/**
 * Asynchronously adds event listeners to filter buttons for works and displays the filtered works.
 *
 * @return {Promise}
 */
function addListeners() {

  allFilter.addEventListener("click", () => {
    filterAllWorks();
    addWorks(works);
  });

  objectsFilter.addEventListener("click", () => {
    const filteredWorks = works.filter(work => work.categoryId === 1);
    filterObjectsWorks();
    addWorks(filteredWorks);
  });

  apartmentsFilter.addEventListener("click", () => {
    const filteredWorks = works.filter(work => work.categoryId === 2);
    filterApartmentsWorks();
    addWorks(filteredWorks);
  });

  hotelsResFilter.addEventListener("click", () => {
    const filteredWorks = works.filter(work => work.categoryId === 3);
    filterHotelsResWorks();
    addWorks(filteredWorks);
  });
}

// ********** MAIN CODE ********** //

fetchWorks()
  .then(() => {
    addWorks(works);
    addListeners();

    if (localStorage.getItem("token")) {
      displayAdminPage();
    } 
  })
  .catch(error => console.log(error))