const popupElement = document.getElementById("popup-container");

function closePopup() {
  popupElement.style.top = "-20%";
}

function popup(message) {
  document.getElementById("popup-message").textContent = message;
  popupElement.style.top = "0";
  setTimeout(closePopup, 7500);
  
}

function validateForm() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

   if (name.length !== 0 && name.length < 2) {
    popup("Name must be longer than 1 character.");
  } else if (email.length !== 0 && email.length < 6) {
    popup("Email must be longer than 6 characters.");
  } else if (message.length < 10) {
    popup("Message must be longer than 10 characters.");
  } else {
    popup("Form submitted successfully! Thank you for your message.");
  }

  return true;
}

document.querySelector("form").addEventListener("submit", function(event) {
   event.preventDefault();
});