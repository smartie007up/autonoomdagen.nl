function clearFormMessages(form) {
  const messages = form.querySelectorAll(".loading-message");
  messages.forEach((msg) => msg.remove());
}

// Function to show info message when waiting for payment/processing of the application
function showInfoMessage(message, element) {
  element.innerText = message;
  element.classList.add("info-message"); // Add instead of overwrite
}
// Function to show error message
function showErrorMessage(message, element) {
  element.innerText = message; // Change loading message to error message
  element.classList.add("error-message"); // Add instead of overwrite
}
// Reusable function to show loading message with fade-out
function showLoadingMessage(form) {
  const loadingMessage = document.createElement("div");
  loadingMessage.classList.add("loading-message");
  showInfoMessage(
    "We verwerken je inschrijving, een moment geduld...",
    loadingMessage
  );
  form.appendChild(loadingMessage);

  // Trigger fade-out effect after 10 seconds
  setTimeout(() => {
    loadingMessage.classList.add("fade-out"); // Triggers the transition
    setTimeout(() => {
      loadingMessage.remove(); // Removes it after fade completes
    }, 500); // Match this with CSS transition duration
  }, 10000);
}
// Reusable function to show error message with fade-out
function createAndShowErrorMessage(message, form) {
  clearFormMessages(form);

  const thisMessage = document.createElement("div");
  thisMessage.classList.add("loading-message");

  // Set the message content
  showErrorMessage(message, thisMessage);

  // Append the message to the form
  form.appendChild(thisMessage);

  // Trigger fade-out effect after 3 seconds
  setTimeout(() => {
    thisMessage.classList.add("fade-out"); // Triggers the transition
    setTimeout(() => {
      thisMessage.remove(); // Removes it after fade completes
    }, 500); // Match this with CSS transition duration
  }, 3000);
}
