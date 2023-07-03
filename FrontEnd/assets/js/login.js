"use strict";

// ********** CONSTANTS ********** //

const LOGIN_URL = "http://localhost:5678/api/users/login";

const emailElt  = document.getElementById("email");
const passElt   = document.getElementById("password");
const loginElt  = document.getElementById("login");

// ********** FUNCTIONS ********** //

async function login(event) {
  event.preventDefault();

  const authData = {
    email: emailElt.value,
    password: passElt.value
  };

  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData)
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    const result = await response.json();

    if (result.token) {
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("token", result.token);

      window.location.href = "index.html";
    }

  } catch (error) {
    if (error.message === "404") {
      alert ("E-mail ou mot de passe incorrect !");

    } else {
      console.error(error)
    }
  }
};

// ********** MAIN CODE ********** //

loginElt.addEventListener("click", login);