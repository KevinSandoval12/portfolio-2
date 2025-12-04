// How Did We Meet? Information
let metBox = document.getElementById("met");
let otherBox = document.getElementById("other");
let otherTitle = document.getElementById("otherTitle");

let mailing = document.getElementById("mailing-list");
let format = document.getElementById("email-format-row");
let html = document.getElementById("html-button");
let text = document.getElementById("text-button");

// Runs when form is submitted
document.getElementById("contact-form").onsubmit = () => {
  clearErrors();

  // Grab Elements
  // Personal Information
  let fnameInput = document.getElementById("fname").value.trim();
  let lnameInput = document.getElementById("lname").value.trim();
  let emailInput = document.getElementById("email").value.trim();

  let isValid = true;
  // have default style of error be "none"
  // but "inline" when requirements not met
  if (!fnameInput) {
    isValid = false;
    document.getElementById("fnameErr").style.display = "inline";
  }

  if (!lnameInput) {
    isValid = false;
    document.getElementById("lnameErr").style.display = "inline";
  }

  // if mailing list is check
  if (mailing.checked) {
    // and email doens't include @ and .
    if (!emailInput.includes("@") || !emailInput.includes(".")) {
      isValid = false;
      document.getElementById("emailErr").style.display = "inline";
    }
  }

  // How we Met
  if (metBox.value == "none") {
    isValid = false;
    document.getElementById("meetErr").style.display = "inline";
  }
  if (metBox.value === "Other") {
    // if otherBox is empty
    if (!otherBox.value.trim()) {
      isValid = false;
      document.getElementById("otherErr").style.display = "inline";
    }
  }

  if (mailing.checked) {
    format.style.display = "inline";
    // if both html or text format buttons arent checked
    if (!html.checked && !text.checked) {
      isValid = false;
      document.getElementById("formatErr").style.display = "inline";
    }
  }

    const formatHidden = document.getElementById("format-hidden");
  if (html.checked) formatHidden.value = "html";
  else if (text.checked) formatHidden.value = "text";
  else formatHidden.value = "";

  return isValid;
}; // End of onsubmit form

// clears Errors funciton
function clearErrors() {
  let errors = document.getElementsByClassName("error");
  for (let error of errors) {
    error.style.display = "none";
  }
}

// function to change the otherBox display
function metBoxDisplay(metBox, otherBox, otherTitle) {
  if (metBox.value == "none") {
    otherBox.style.display = "none";
  }
  if (metBox.value == "LinkedIn") {
    otherTitle.value = "LinkedIn";
    otherTitle.style.display = "block";
    otherBox.style.display = "inline";
    otherBox.placeholder = "LinkedIn";
  }
  if (metBox.value == "Other") {
    otherBox.style.display = "inline";
    otherTitle.style.display = "block";
  }
}

// function to change display of text format
function textFormat(mailing, html, text) {
  if (mailing.checked) {
    format.style.display = "inline";
  }
  if (!mailing.checked) {
    format.style.display = "none";
  }
}

metBox.addEventListener("change", () =>
  metBoxDisplay(metBox, otherBox, otherTitle)
);

mailing.addEventListener("change", () => textFormat(mailing, html, text));
