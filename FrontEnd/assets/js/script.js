"use strict";

// ********** CONSTANTS ********** //

const gallery = document.querySelector(".gallery");
const allFilter = document.getElementById("all");
const objectsFilter = document.getElementById("objects");
const apartmentsFilter = document.getElementById("apartments");
const hotelsResFilter = document.getElementById("hotelsRes");
const authElt = document.querySelector('[href="login.html"]');
const header = document.querySelector("header");

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
  const body              = document.querySelector("body");
  const introImg          = document.querySelector('#introduction figure');
  const introArticle      = document.querySelector('#introduction article');
  const portfolioGallery  = document.querySelector('#portfolio h2');

  const bodyBanner      = document.createElement('div');
  const editBanner      = document.createElement('button');
  const editChanges     = document.createElement('button');
  const editImg         = document.createElement('button');
  const editArticle     = document.createElement('button');
  const editGallery     = document.createElement('button');

  authElt.innerText         = "logout";
  editBanner.innerHTML      = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
  editChanges.innerText     = "publier les changements";
  editImg.innerHTML         = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  editArticle.innerHTML     = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  editGallery.innerHTML     = '<i class="fa-regular fa-pen-to-square"></i> modifier';

  header.classList.add('header-admin');
  authElt.setAttribute("href", "#");
  authElt.addEventListener("click", (event) => { 
    logout(event, bodyBanner, editBanner, editChanges, editImg, editArticle, editGallery)
  });

  editBanner.classList.add("btn-1");
  editChanges.classList.add("btn-2");
  editImg.classList.add("btn-3");
  editArticle.classList.add("btn-4");
  editGallery.classList.add("btn-5");

  body.insertBefore(bodyBanner, body.firstChild);
  introArticle.insertBefore(editArticle, introArticle.firstChild);
  bodyBanner.appendChild(editBanner);
  bodyBanner.appendChild(editChanges);
  introImg.appendChild(editImg);
  portfolioGallery.insertAdjacentElement('afterend', editGallery);
}

/**
 * Logs out the current user and performs necessary cleanup.
 *
 * @param {Event} event - The event object triggered by the logout action.
 * @param {HTMLElement} bodyBanner - The banner element representing the body.
 * @param {HTMLElement} editBanner - The banner element representing the edit section.
 * @param {HTMLElement} editChanges - The element for publishing changes.
 * @param {HTMLElement} editImg - The element for editing images.
 * @param {HTMLElement} editArticle - The element for editing articles.
 * @param {HTMLElement} editGallery - The element for editing galleries.
 */
function logout(event, bodyBanner, editBanner, editChanges, editImg, editArticle, editGallery) {
  event.preventDefault();

  const loginLink = document.createElement("a");
  loginLink.href = "login.html";
  loginLink.innerText = "login";

  authElt.parentNode.replaceChild(loginLink, authElt);
  header.classList.remove('header-admin');

  bodyBanner.remove();
  editBanner.remove();
  editChanges.remove();
  editImg.remove();
  editArticle.remove();
  editGallery.remove();

if (localStorage.getItem("token")) {
  alert ("Vous êtes déconnecté");
  }

  localStorage.removeItem("token") && localStorage.removeItem("userId");
}

/**
 * Creates a modal and adds it to the document body.
 *
 *
 */
function createModal() {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  modalContainer.setAttribute('role', 'dialog');
  modalContainer.setAttribute('aria-modal', 'true');
  modalContainer.setAttribute('aria-labelledby', 'modal-title');
  modalContainer.addEventListener('click', closeModal);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalContent.addEventListener('click', event => event.stopPropagation());

  const closeButton = document.createElement('button');
  closeButton.classList.add('modal-close');
  closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.addEventListener('click', closeModal);

  const modalTitle = document.createElement('h3');
  modalTitle.classList.add('modal-title');
  modalTitle.textContent = 'Galerie photo';
  modalTitle.setAttribute('id', 'modal-title');

  const imagesContainer = document.createElement('div');
  imagesContainer.classList.add('images-container');

  // Loop through the works array to create image thumbnails and edit buttons
  for (let i = 0; i < works.length; i++) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');

    const image = document.createElement('img');
    image.src = works[i].imageUrl;

    const moveButton = document.createElement('i');
    moveButton.classList.add('fa-solid');
    moveButton.classList.add('fa-arrows-up-down-left-right');

    const trashButton = document.createElement('i');
    trashButton.classList.add('fa-solid');
    trashButton.classList.add('fa-trash-can');
    trashButton.addEventListener('click', () => {
      const imageId = works[i].id;
      deleteImage(imageId);
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'éditer';

    imageWrapper.appendChild(image);
    imageWrapper.appendChild(moveButton);
    imageWrapper.appendChild(trashButton);
    imageWrapper.appendChild(editButton);
    imagesContainer.appendChild(imageWrapper);
  }

  const separator = document.createElement('div');
  separator.classList.add('separator');

  const addButton = document.createElement('button');
  addButton.classList.add('modal-addbtn');
  addButton.textContent = 'Ajouter une photo';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('modal-deletebtn');
  deleteButton.textContent = 'Supprimer la galerie';

  modalContent.appendChild(closeButton);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(imagesContainer);
  modalContent.appendChild(separator);
  modalContent.appendChild(addButton);
  modalContent.appendChild(deleteButton);

  modalContainer.appendChild(modalContent);

  document.body.appendChild(modalContainer);

  document.addEventListener('keydown', handleKeyPress);
}

async function deleteImage(imageId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      const imageWrapper = document.querySelector(`.image-wrapper[data-id="${imageId}"]`);
      if (imageWrapper) {
        imageWrapper.remove();
  }
    } else {
      console.error('Image deletion failed:', response.status);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

/**
 * Closes the modal.
 *
 * 
 */
function closeModal() {
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.remove();

  document.removeEventListener('keydown', handleKeyPress);
}

/**
 * Handles key press events.
 *
 * @param {Event} event - The key press event.
 */
function handleKeyPress(event) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    closeModal();
  }
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
      const modalButton = document.querySelector('.btn-5');
      modalButton.addEventListener('click', createModal);
    } 
  })
  .catch(error => console.log(error));