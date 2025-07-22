/* 
Send form for particulieren/ZZP-er
*/
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#particulier").addEventListener("click", () => {
    const form = document.getElementById("wf-form-Inschrijfformulier");

    const recaptchaResponse = form.querySelector(
      '[name="g-recaptcha-response"]'
    )?.value;
    if (!recaptchaResponse) {
      createAndShowErrorMessage("Bevestig dat je geen robot bent.", form);
      return;
    }

    if (!form.checkValidity()) {
      // Show error message if form is invalid
      createAndShowErrorMessage(
        "Vul alsjeblieft alle (verplichte) velden in.",
        form
      );
      return;
    }

    const formData = new FormData(form);

    // Define all guest-related input groups
    const fieldNames = ["name", "phone", "gender", "diet"];
    const inputs = {};

    const guestsRegular = collectGuestData(".guest-wrapper", "guest");

    // Now append the guests array to the FormData object
    formData.append("guests", JSON.stringify(guestsRegular)); // Convert guests array to JSON string

    // Add loading message to the form
    showLoadingMessage(form);

    const webhookURL = "https://proxy-regular.marthe-911.workers.dev/";

    fetch(webhookURL, {
      method: "POST",
      headers: {
        "X-Auth-Token":
          "5758d2ffc3d53d1964ca691e77f131c72747876183c84133e3443f107dd07a4a",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Webhook Response Data:", data); // Log the webhook response data
        if (data.redirect) {
          window.location.href = data.redirect; // Redirect to Stripe
        } else {
          // Show error message
          createAndShowErrorMessage(
            "Er is een probleem met het ontvangen van de betalingslink. Herlaad de pagina en probeer het opnieuw.",
            form
          );
        }
      })
      .catch((error) => {
        // Show error message in case of failure
        console.error("Error during fetch:", error);
        createAndShowErrorMessage(
          "Er is een fout opgetreden bij de betaling. Herlaad de pagina en probeer het opnieuw.",
          form
        );
      });
  });
});

/*
Send form for company employees (form submit to the webhook and then: redirect to payment link or back to website).
*/
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#pay-now").addEventListener("click", () => {
    submitForm("pay-now");
  });

  document.querySelector("#pay-later").addEventListener("click", () => {
    submitForm("pay-later");
  });
});

function submitForm(paymentType) {
  // Select the form by its ID
  const form = document.getElementById("wf-form-Company-form");
  // Select both buttons
  const buttons = document.querySelectorAll("#pay-now, #pay-later");
  const paymentChoiceInput = document.getElementById("payment-choice");
  paymentChoiceInput.value = paymentType;

  const recaptchaResponse = form.querySelector(
    '[name="g-recaptcha-response"]'
  )?.value;
  if (!recaptchaResponse) {
    createAndShowErrorMessage("Bevestig dat je geen robot bent.", form);
    return;
  }

  if (!form.checkValidity()) {
    // Show error message if form is invalid
    createAndShowErrorMessage(
      "Vul alsjeblieft alle (verplichte) velden in.",
      form
    );
    return;
  }

  // Create a FormData object from the form
  const formData = new FormData(form);

  // Hide the buttons
  buttons.forEach((btn) => (btn.style.display = "none"));

  const guestsCompany = collectGuestData(
    ".guest-wrapper-company",
    "guest-company"
  );
  // Now append the guests array to the FormData object
  formData.append("guests", JSON.stringify(guestsCompany));
  // Add loading message to the form
  showLoadingMessage(form);

  const companyWebhookUrl = "https://proxy.marthe-911.workers.dev/";

  // Set up an AJAX request to submit the form data
  fetch(companyWebhookUrl, {
    method: "POST",
    headers: {
      "X-Auth-Token":
        "2b88b3970496943b39df41521f9a266a073da755ee349398866cf094edcbab6a",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.redirect) {
        window.location.href = data.redirect; // Redirect to payment page
      } else {
        // Show error message
        createAndShowErrorMessage(
          "Er is een probleem met het ontvangen van de betalingslink. Herlaad de pagina en probeer het opnieuw.",
          form
        );
      }
    })
    .catch((error) => {
      // Show error message in case of failure
      console.error("Error during fetch:", error);
      createAndShowErrorMessage(
        "Er is een fout opgetreden bij de betaling. Herlaad de pagina en probeer het opnieuw.",
        form
      );
    });
}
