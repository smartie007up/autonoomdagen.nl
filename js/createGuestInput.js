document.addEventListener("DOMContentLoaded", () => {
  const selectTickets = document.getElementById("select-tickets");
  const guestBlock = document.querySelector(".guest-block");
  const guestWrapper = document.querySelector(".guest-wrapper");

  const selectTicketsCompany = document.getElementById("select-tickets-company");
  const guestBlockCompany = document.querySelector(".guest-block-company");
  const guestWrapperCompany = document.querySelector(".guest-wrapper-company");

  const createInput = (type, id, placeholder = "") => {
    const input = document.createElement(type === "select" ? "select" : "input");

    if (type !== "select") {
      input.type = type;
      input.placeholder = placeholder;
    }

    input.id = id;
    input.classList.add("w-input", type === "select" ? "guest-select" : "guest-input");

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

  const createGuestBlock = (index, prefix = "guest") => {
    const guestDiv = document.createElement("div");
    guestDiv.className = "guest";
    guestDiv.id = `${prefix}-${index}`;

    const naamInput = createInput("text", `${prefix}-naam-${index}`, "Naam");
    naamInput.maxLength = 70; // Set your desired max length
    naamInput.required = true;
    guestDiv.appendChild(naamInput);

    const telInput = createInput("text", `${prefix}-tel-${index}`, "Tel");
    telInput.maxLength = 25; // Adjust based on expected phone number length
    telInput.required = true;
    guestDiv.appendChild(telInput);

    const genderSelect = createInput("select", `${prefix}-geslacht-${index}`);
    genderSelect.required = true;
    guestDiv.appendChild(genderSelect);

    const dieetInput = createInput("text", `${prefix}-dieet-${index}`, "Allergieën");
    dieetInput.maxLength = 200;
    guestDiv.appendChild(dieetInput);

    return guestDiv;
  };

  const updateGuestFields = (ticketCount, block, wrapper, prefix, offset = 1) => {
    const guestCount = Math.max(0, ticketCount - offset);
    block.style.display = guestCount > 0 ? "block" : "none";
    wrapper.innerHTML = "";

    for (let i = 1; i <= guestCount; i++) {
      wrapper.appendChild(createGuestBlock(i, prefix));
    }
  };

  const handleRegularGuests = () => {
    const ticketCount = parseInt(selectTickets.value, 10) || 1;
    updateGuestFields(ticketCount, guestBlock, guestWrapper, "guest", 1);
    bindValidationToAllGuestInputs(); // ✅ bind after dynamic fields created
  };

  const handleCompanyGuests = () => {
    const ticketCount = parseInt(selectTicketsCompany.value, 10) || 0;
    updateGuestFields(ticketCount, guestBlockCompany, guestWrapperCompany, "guest-company", 0);
    bindValidationToAllGuestInputs(); // ✅ bind after dynamic fields created
  };

  // Validation functions
  const validateName = (value) => /^[A-Za-zÀ-ÿ\s]{1,70}$/.test(value);
  const validateTel = (value) => /^[+\d]*$/.test(value);
  const validateGender = (value) => ["man", "vrouw", "anders"].includes(value);
  const validateDieet = (value) => /^[A-Za-z.\s]{0,200}$/.test(value);

  const validateGuestFields = (prefix, count) => {
    let allValid = true;

    for (let i = 1; i <= count; i++) {
      const naam = document.getElementById(`${prefix}-naam-${i}`);
      const tel = document.getElementById(`${prefix}-tel-${i}`);
      const geslacht = document.getElementById(`${prefix}-geslacht-${i}`);
      const dieet = document.getElementById(`${prefix}-dieet-${i}`);

      // Reset styles
      [naam, tel, geslacht, dieet].forEach((el) => (el.style.borderColor = ""));

      if (naam.value.trim() === "" || !validateName(naam.value)) {
        naam.style.borderColor = "red";
        allValid = false;
      }
      if (tel.value.trim() === "" || !validateTel(tel.value)) {
        tel.style.borderColor = "red";
        allValid = false;
      }
      if (geslacht.value === "" || !validateGender(geslacht.value)) {
        geslacht.style.borderColor = "red";
        allValid = false;
      }
      if (dieet && dieet.value.trim() !== "" && !validateDieet(dieet.value)) {
        dieet.style.borderColor = "red";
        allValid = false;
      }
    }

    return allValid;
  };

  // Example: You can call this before form submission to validate all guests
  const validateAllGuests = () => {
    const regularCount = Math.max(0, (parseInt(selectTickets.value, 10) || 1) - 1);
    const companyCount = parseInt(selectTicketsCompany.value, 10) || 0;

    const regularValid = validateGuestFields("guest", regularCount);
    const companyValid = validateGuestFields("guest-company", companyCount);

    return regularValid && companyValid;
  };

  selectTickets.addEventListener("change", handleRegularGuests);
  selectTicketsCompany.addEventListener("change", handleCompanyGuests);

  handleRegularGuests();
  handleCompanyGuests();

  // Expose validation to global if needed
  window.validateAllGuests = validateAllGuests;
});

function collectGuestData(containerSelector, prefix) {
  const guestDivs = document.querySelectorAll(`${containerSelector} .guest`);
  const guests = [];

  guestDivs.forEach((guestDiv, index) => {
    const guest = {
      name: document.getElementById(`${prefix}-naam-${index + 1}`)?.value || "",
      phone: document.getElementById(`${prefix}-tel-${index + 1}`)?.value || "",
      gender: document.getElementById(`${prefix}-geslacht-${index + 1}`)?.value || "",
      diet: document.getElementById(`${prefix}-dieet-${index + 1}`)?.value || "",
    };
    guests.push(guest);
  });

  return guests;
}
