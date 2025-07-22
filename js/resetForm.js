/*
Reset the forms and clear guest wrappers when the other button is clicked
*/
function resetRegularFormNoGuest() {
  const form = document.getElementById("wf-form-Inschrijfformulier");
  const guestWrapper = document.querySelector(".guest-wrapper");
  const numberOfPeopleWrapper = document.getElementById(
    "numberOfPeople-wrapper"
  );

  if (form) {
    form.reset();

    // Remove validation error messages inside the form
    const errors = form.querySelectorAll(".loading-message.error-message");
    errors.forEach((errorDiv) => errorDiv.remove());

    // Remove input-error class from all inputs in the form
    const inputs = form.querySelectorAll(".input-error");
    inputs.forEach((input) => input.classList.remove("input-error"));

    if (numberOfPeopleWrapper) {
      numberOfPeopleWrapper.style.display = "none";
    }
  }

  // Clear all guests (no guest added back)
  if (guestWrapper) {
    guestWrapper.innerHTML = "";
  }

  // Clear error container if used
  const errorContainer = document.getElementById("error-container-reg");
  if (errorContainer) {
    errorContainer.innerHTML = "";
  }

  bindValidationToAllGuestInputs();
}

function resetCompanyFormKeepOneGuest() {
  const form = document.getElementById("wf-form-Company-form");
  const guestWrapperCompany = document.querySelector(".guest-wrapper-company");

  if (form) {
    form.reset();

    // Remove validation error messages inside the form
    const errors = form.querySelectorAll(".loading-message.error-message");
    errors.forEach((errorDiv) => errorDiv.remove());

    // Remove input-error class from all inputs in the form
    const inputs = form.querySelectorAll(".input-error");
    inputs.forEach((input) => input.classList.remove("input-error"));
  }

  if (guestWrapperCompany) {
    guestWrapperCompany.innerHTML = "";
    // Add back one empty guest block
    const createInput = (type, id, placeholder = "") => {
      const input = document.createElement(
        type === "select" ? "select" : "input"
      );

      if (type !== "select") {
        input.type = type;
        input.placeholder = placeholder;
      }

      input.id = id;
      input.classList.add(
        "w-input",
        type === "select" ? "guest-select" : "guest-input"
      );

      if (type === "select") {
        [
          { value: "", text: "Kies..." },
          { value: "man", text: "Man" },
          { value: "vrouw", text: "Vrouw" },
          { value: "anders", text: "Anders" },
        ].forEach(({ value, text }) => {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = text;
          input.appendChild(option);
        });
      }

      return input;
    };

    const guestDiv = document.createElement("div");
    guestDiv.className = "guest";
    guestDiv.id = "guest-company-1";

    const guestCompanyNaam = createInput(
      "text",
      "guest-company-naam-1",
      "Naam"
    );
    guestCompanyNaam.maxLength = 70;
    guestDiv.appendChild(guestCompanyNaam);

    const guestCompanyTel = createInput("text", "guest-company-tel-1", "Tel");
    guestCompanyTel.maxLength = 25;
    guestDiv.appendChild(guestCompanyTel);

    guestDiv.appendChild(createInput("select", "guest-company-geslacht-1"));

    const dieetInput = createInput(
      "text",
      "guest-company-dieet-1",
      "Allergieën"
    );
    dieetInput.maxLength = 200;
    guestDiv.appendChild(dieetInput);

    guestWrapperCompany.appendChild(guestDiv);

    bindValidationToAllGuestInputs();
  }

  // Clear error container if used
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.innerHTML = "";
  }
}

// Bind buttons
const btnRegular = document.getElementById("button-particulier");
if (btnRegular) {
  btnRegular.addEventListener("click", resetRegularFormNoGuest);
}

const btnCompany = document.getElementById("button-bedrijf");
if (btnCompany) {
  btnCompany.addEventListener("click", resetCompanyFormKeepOneGuest);
}
