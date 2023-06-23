"use strict";

// ********** CONSTANTS ********** //

const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// ********** VARIABLES ********** //

// ********** FUNCTIONS ********** //

async function login() {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value
    }),
    headers: {
      "Content-Type": "application/json",
    }
  })

  const result = await response.json();

  if (response.ok) {
    // Stock the token in local storage
    localStorage.setItem("token", result.token);
    // Redirect to index.html
    window.location.href = "index.html";
  } else {
    alert("Votre e-mail ou mot de passe est incorrect");
  }
}

// ********** MAIN CODE ********** //

form.addEventListener("submit", (event) => {
  event.preventDefault();
  login();
})