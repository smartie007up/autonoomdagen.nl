/*
Code for field validation on Webflow forms
*/
document.addEventListener("DOMContentLoaded", () => {
  const validationRules = {
    name: {
      pattern: /^[A-Za-zÀ-ÿ\s'-]+$/,
      errorMsg: "Gebruik een geldige naam."
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMsg: "Voer een geldig e-mailadres in.",
      blurOnly: true
    },
    tel: {
      pattern: /^[\d+\s()-]{6,}$/,
      errorMsg: "Voer een geldig telefoonnummer in.",
      blurOnly: true
    },
    
    diet: {
      pattern: /^[A-Za-zÀ-ÿ\s.!]*$/,
      errorMsg: "Gebruik alleen normale tekens voor dieetwensen."
    },    
    company: {
      pattern: /^[\wÀ-ÿ0-9 '&+.,()\/-]*$/,
      errorMsg: "Gebruik een geldige bedrijfsnaam."
    },
    street: {
      pattern: /^[A-Za-zÀ-ÿ0-9\s.'\-/,]{2,}$/,
      errorMsg: "Voer een geldige straatnaam in.",
      blurOnly: true
    },
    postalcode: {
      pattern: /^([1-9][0-9]{3}\s?[A-Za-z]{2}|[1-9][0-9]{3})$/,
      errorMsg: "Gebruik een geldige postcode, zoals 1234 AB of 1000.",
      blurOnly: true
    },
    location: {
      pattern: /^[A-Za-zÀ-ÿ\s.'-]{2,}$/,
      errorMsg: "Voer een geldige plaatsnaam in.",
      blurOnly: true
    },
    country: {
      pattern: /^[A-Za-zÀ-ÿ\s.'-]{2,}$/,
      errorMsg: "Voer een geldig land in.",
      blurOnly: true
    }
  };

  function showInlineError(el, msg) {
    const next = el.nextElementSibling;
    if (next?.classList.contains("loading-message")) next.remove();

    if (el.value.trim() === "") {
      el.classList.remove("input-error");
      return;
    }

    if (!msg) return;
    const msgEl = document.createElement("div");
    msgEl.innerText = msg;
    msgEl.className = "loading-message error-message";
    el.insertAdjacentElement("afterend", msgEl);
    el.classList.add("input-error");
  }

  function showEndError(el, msg) {
    const form = el.closest('form');
    if (!form) return;

    let containerId = "error-container";    
    if (form.id === "wf-form-Inschrijfformulier") {
      containerId = "error-container-reg";
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    removeEndError(el);
    const errorEl = document.createElement("div");
    errorEl.className = "loading-message error-message";
    errorEl.innerText = msg;
    errorEl.dataset.forInput = el.id || el.name;
    container.appendChild(errorEl);
    el.classList.add("input-error");
  }


  function removeInlineError(el, pattern) {
    const next = el.nextElementSibling;
   if (next?.classList.contains("loading-message") && (el.value.trim() === "" || pattern.test(el.value.trim()))) {
      next.remove();
      el.classList.remove("input-error");
    } else if (el.value.trim() === "") {
      el.classList.remove("input-error");
    }
  }

  function removeEndError(el) {
    el.classList.remove("input-error");
    const form = el.closest("form");
    if (!form) return;
    const errors = form.querySelectorAll(".loading-message.error-message");
    errors.forEach(err => {
      if (err.dataset.forInput === (el.id || el.name)) {
        err.remove();
      }
    });
  }

  function bindValidation(el, rule, display = "inline") {
    const show = display === "end" ? showEndError : showInlineError;
    const remove = display === "end" ? removeEndError : () => removeInlineError(el, rule.pattern);

    const validate = () => {
      const value = el.value.trim();
      if (value === "") {
        remove(el);
      } else if (!rule.pattern.test(value)) {
        show(el, rule.errorMsg);
      } else {
        remove(el);
      }
    };

    if (rule.blurOnly) {
      el.addEventListener("blur", validate);
      el.addEventListener("input", () => {
        if (el.value.trim() === "") remove(el);
      });
    } else {
      el.addEventListener("input", validate);
    }
  }

  // Automatically detect what fields to bind by naming pattern or explicit rules
  const fieldConfig = [
    // Regular form
    { selector: "#firstname", rule: validationRules.name },
    { selector: "#lastname", rule: validationRules.name },
    { selector: "#email", rule: validationRules.email },
    { selector: "#telephonenumber", rule: validationRules.tel },
  //  { selector: "#diet", rule: validationRules.diet },
    { selector: "#company_name", rule: validationRules.company },
		{ selector: "#street1", rule: validationRules.street },
    { selector: "#postalcode1", rule: validationRules.postalcode },
    { selector: "#location1", rule: validationRules.location },
    { selector: "#country1", rule: validationRules.country },


    // Company form
    { selector: "#Contactpersoon-bedrijfsnaam", rule: validationRules.company },
    { selector: "#Contactpersoon-voornaam", rule: validationRules.name },
    { selector: "#Contactpersoon-achternaam", rule: validationRules.name },
    { selector: "#Contactpersoon-tel", rule: validationRules.tel },
    { selector: "#Contactpersoon-mail", rule: validationRules.email },
		{ selector: "#street", rule: validationRules.street },
    { selector: "#postalcode", rule: validationRules.postalcode },
    { selector: "#location", rule: validationRules.location },
    { selector: "#country", rule: validationRules.country },
  ];

  fieldConfig.forEach(({ selector, rule }) => {
    const el = document.querySelector(selector);
    if (el) bindValidation(el, rule);
  });

 function bindValidationToAllGuestInputs() {
    const guestFieldDefs = [
      { prefix: "guest-naam-", rule: validationRules.name },
      { prefix: "guest-tel-", rule: validationRules.tel },
     // { prefix: "guest-dieet-", rule: validationRules.diet },
      { prefix: "guest-company-naam-", rule: validationRules.name },
      { prefix: "guest-company-tel-", rule: validationRules.tel },
     //{ prefix: "guest-company-dieet-", rule: validationRules.diet }
    ];

    guestFieldDefs.forEach(({ prefix, rule }) => {
			document.querySelectorAll(`input[id^='${prefix}']`).forEach(input => {
        bindValidation(input, rule, "end");
      });     
		});
	}

    // ✅ Expose functions to window for external use
    window.validationRules = validationRules;
    window.bindValidation = bindValidation;
    window.bindValidationToAllGuestInputs = bindValidationToAllGuestInputs;
});
