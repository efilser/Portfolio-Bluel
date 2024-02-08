"use strict";

// ********** CONSTANTS ********** //

const gallery = document.querySelector(".gallery");
const allFilter = document.getElementById("all");
const objectsFilter = document.getElementById("objects");
const apartmentsFilter = document.getElementById("apartments");
const hotelsResFilter = document.getElementById("hotelsRes");
const authElt = document.querySelector('[href="login.html"]');
const header = document.querySelector("header");
const userId = localStorage.getItem('userId');

// ********** VARIABLES ********** //

let works = [];

let modalContainer = null;
let addModalContainer = null;

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
  const filters           = document.querySelector('.filters');

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

  filters.classList.remove('filters');
  filters.classList.add('hide-filters');

  header.classList.add('header-admin');
  authElt.setAttribute("href", "#");
  authElt.addEventListener("click", (event) => { 
    logout(event, bodyBanner, editBanner, editChanges, editImg, editArticle, editGallery)
  });

  editBanner.classList.add("btn-1");
  editChanges.classList.add("btn-2");
  editImg.classList.add("btn-3");
  editArticle.classList.add("btn-4");
  editGallery.classList.add("editWorksBtn");

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

  const filters = document.querySelector('.hide-filters');

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

  filters.classList.remove('hide-filters');
  filters.classList.add('filters')

if (localStorage.getItem("token")) {
  alert ("Vous êtes déconnecté");
  }

  localStorage.removeItem("token") && localStorage.removeItem("userId");
}

/**
 * Creates a modal and appends it to the document body if it doesn't already exist.
 *
 *
 */
function createModal() {
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    modalContainer.setAttribute('role', 'dialog');
    modalContainer.setAttribute('aria-modal', 'true');
    modalContainer.setAttribute('aria-labelledby', 'modal-title');
    modalContainer.addEventListener('click', closeModal);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.addEventListener('click', event => event.stopPropagation());

    const closeButton = document.createElement('i');
    closeButton.classList.add('fa-solid', 'fa-xmark', 'modal-close');
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
      moveButton.classList.add('fa-solid', 'fa-arrows-up-down-left-right');

      const trashButton = document.createElement('i');
      trashButton.classList.add('fa-solid', 'fa-trash-can');
      trashButton.addEventListener('click', () => {
        const imageId = works[i].id;
        const imageTitle = works[i].title
        deleteImage(imageId, imageTitle);
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
    addButton.addEventListener('click', () => {
      closeModal();
      createAddModal();
    });

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
  }

  document.addEventListener('keydown', handleKeyPress);

  modalContainer.classList.add('show');
}

/**
 * Creates an add modal that allows users to add a photo with a title and category.
 *
 *
 */
function createAddModal() {
  if (!addModalContainer) {
    addModalContainer = document.createElement('div');
    addModalContainer.classList.add('add-modal-container');
    addModalContainer.setAttribute('role', 'dialog');
    addModalContainer.setAttribute('aria-modal', 'true');
    addModalContainer.setAttribute('aria-labelledby', 'modal-title');
    addModalContainer.addEventListener('click', closeAddModal);

    const addModalContent = document.createElement('div');
    addModalContent.classList.add('modal-content', 'add-modal-content');
    addModalContent.addEventListener('click', event => event.stopPropagation());

    const addCloseButton = document.createElement('i');
    addCloseButton.classList.add('fa-solid', 'fa-xmark', 'modal-close');
    addCloseButton.setAttribute('aria-label', 'Close');
    addCloseButton.addEventListener('click', closeAddModal);

    const addReturnButton = document.createElement('i');
    addReturnButton.classList.add('fa-solid', 'fa-arrow-left', 'modal-return');
    addReturnButton.setAttribute('aria-label', 'Return');
    addReturnButton.addEventListener('click', () => {
      closeAddModal();
      createModal();
    });

    const addModalTitle = document.createElement('h3');
    addModalTitle.classList.add('modal-title');
    addModalTitle.textContent = 'Ajout Photo';
    addModalTitle.setAttribute('id', 'modal-title');

    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('enctype', 'multipart/form-data');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
    });

    const addPhotoWindow = document.createElement('div');
    addPhotoWindow.classList.add('add-photo-window');

    const addPreview = document.createElement('img');
    addPreview.classList.add('preview-image');
    addPhotoWindow.appendChild(addPreview);


    const addIcon = document.createElement('i');
    addIcon.classList.add('fa-regular', 'fa-image');

    const addLabel = document.createElement('label');
    addLabel.classList.add('add-photo');
    addLabel.textContent = '+ Ajouter photo';

    const addPhoto = document.createElement('input');
    addPhoto.type = 'file';
    addPhoto.accept = '.jpeg, .jpg, .png';
    addPhoto.addEventListener('change', function(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
    
      reader.onload = function(e) {
        addPreview.src = e.target.result;
    
        if (file) {
          addPreview.classList.add('show'); // Show the preview
          addIcon.classList.add('hide'); // Hide the other elements
          addLabel.classList.add('hide');
          addPhoto.classList.add('hide');
          sizeInfo.classList.add('hide');
        } else {
          addPreview.classList.remove('show'); // Hide the preview
          addIcon.classList.remove('hide'); // Show the other elements
          addLabel.classList.remove('hide');
          addPhoto.classList.remove('hide');
          sizeInfo.classList.remove('hide');
        }
      };
    
      reader.readAsDataURL(file);
    });

    const sizeInfo = document.createElement('p');
    sizeInfo.classList.add('size-info');
    sizeInfo.textContent = 'jpg, png : 4mo max';

    const titleLabel = document.createElement('label');
    titleLabel.classList.add('text-form-label');
    titleLabel.textContent = 'Titre';

    const addTitle = document.createElement('input');
    addTitle.classList.add('add-title');
    addTitle.type = 'text';

    const categoryLabel = document.createElement('label');
    categoryLabel.classList.add('select-form-label');
    categoryLabel.textContent = 'Catégorie';

    const addCategory = document.createElement('select');
    addCategory.classList.add('add-category');

    const defaultOption = document.createElement('option');
    defaultOption.selected = true;

    const option1 = document.createElement('option');
    option1.value = 1;
    option1.textContent = 'Objets';

    const option2 = document.createElement('option');
    option2.value = 2;
    option2.textContent = 'Appartements';

    const option3 = document.createElement('option');
    option3.value = 3;
    option3.textContent = 'Hôtels & restaurants';

    const addSeparator = document.createElement('div');
    addSeparator.classList.add('separator');

    const validationBtn = document.createElement('button');
    validationBtn.classList.add('modal-addbtn', 'validation-btn');
    validationBtn.textContent = 'Valider';
    validationBtn.type = 'submit';
    validationBtn.addEventListener('click', function(event) {
      event.preventDefault();

      // Check if any field is missing
      if (!addPhoto.files[0] || !addTitle.value || !addCategory.value) {
        let errorMessage = 'Merci de remplir les champs suivants:';

        if (!addPhoto.files[0]) {
          errorMessage += '\n- Photo';
        }

        if (!addTitle.value) {
          errorMessage += '\n- Titre';
        }

        if (!addCategory.value) {
          errorMessage += '\n- Catégorie';
        }

        alert(errorMessage);
      } else {
        // All fields are filled, update the button class
        validationBtn.classList.add('success');

        addImage();
      }
    });


    addPhotoWindow.appendChild(addIcon);
    addPhotoWindow.appendChild(addLabel);
    addPhotoWindow.appendChild(sizeInfo);

    addLabel.appendChild(addPhoto);

    addCategory.appendChild(defaultOption);
    addCategory.appendChild(option1);
    addCategory.appendChild(option2);
    addCategory.appendChild(option3);

    titleLabel.appendChild(addTitle);
    categoryLabel.appendChild(addCategory);

    form.appendChild(addPhotoWindow);
    form.appendChild(titleLabel);
    form.appendChild(categoryLabel);
    form.appendChild(addSeparator);
    form.appendChild(validationBtn);

    addModalContent.appendChild(addCloseButton);
    addModalContent.appendChild(addReturnButton);
    addModalContent.appendChild(addModalTitle);
    addModalContent.appendChild(form);

    addModalContainer.appendChild(addModalContent);

    document.body.appendChild(addModalContainer);
  }

  document.addEventListener('keydown', handleKeyPress);

  addModalContainer.classList.add('show');
}

/**
 * Close the first modal.
 *
 *
 */
function closeModal() {
  modalContainer = document.querySelector('.modal-container');
  modalContainer.classList.remove('show');

  document.removeEventListener('keydown', handleKeyPress);
}

/**
 * Close the second modal and reset the form.
 *
 *
 */
function closeAddModal() {
  // Reset the form elements to their initial state
  document.querySelector('.preview-image').src = '';
  document.querySelector('.preview-image').classList.remove('show');
  document.querySelector('.fa-image').classList.remove('hide');
  document.querySelector('.add-photo').classList.remove('hide');
  document.querySelector('input[type="file"]').classList.remove('hide');
  document.querySelector('.size-info').classList.remove('hide');
  document.querySelector('.add-title').value = '';
  document.querySelector('.add-category').selectedIndex = 0;

  document.querySelector('.add-modal-container').classList.remove('show');

  // Check if the first modal is still open
  modalContainer = document.querySelector('.modal-container');
  if (!modalContainer) {
    document.removeEventListener('keydown', handleKeyPress);
  }
}

/**
 * Handles key press events.
 *
 * @param {Event} event - The key press event.
 */
function handleKeyPress(event) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    if (addModalContainer) {
      closeAddModal();
    } else {
      closeModal();
    }
  }
}

/**
 * Deletes an image from the server.
 *
 * @param {string} imageId - The ID of the image to delete.
 * @param {string} imageTitle - The title of the image to delete.
 * @return {Promise<void>} A promise that resolves when the image is successfully deleted.
 */
async function deleteImage(imageId, imageTitle) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la photo : ${imageTitle} ?`)) {

    try {
      let response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchWorks();
        addWorks(works);
        imageWrapper.remove();
      } else {
        console.error('Image deletion failed:', response.status);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
}

/**
 * Function to add an image using FormData and fetch API.
 *
 *
 */
async function addImage() {
  const formData = new FormData();
  const image = document.querySelector("form input[type='file']");
  const title = document.querySelector(".add-title");
  const category = document.querySelector(".add-category");

  formData.append("image", image.files[0]);
  formData.append("title", title.value);
  formData.append("category", category.value);

  console.log(formData);

  try {
    let response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData
    })

    if (response.ok) {
      await fetchWorks();
      addWorks(works);
    } else {
      console.error('Add work failed:', response.status);
    }
  } catch (error) {
    console.error("Error:", error);
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
      const modalButton = document.querySelector('.editWorksBtn');
      modalButton.addEventListener('click', createModal);
    } 
  })
  .catch(error => console.log(error));
