
/*
  AMP HEATING & COOLING
  Service Request System

  Website: https://www.7-amp.com
  Email: ampservice586@gmail.com
  Phone: (630) 380-1017

  Form Provider: FormSubmit.co (FREE)
*/

// =====================================
// BUSINESS INFORMATION
// =====================================

const AMP_FORM_RECIPIENT = "ampservice586@gmail.com";

const AMP_PHONE = "(630) 380-1017";

const AMP_PHONE_LINK = "6303801017";

const AMP_FORM_ENDPOINT =
  "https://formsubmit.co/" + AMP_FORM_RECIPIENT;

const AMP_RESPONSE =
  "Thank you for contacting AMP Heating & Cooling! " +
  "We have received your service request. " +
  "Our team will review your information and " +
  "contact you to discuss scheduling. " +
  "Your appointment is NOT confirmed yet. " +
  "For urgent HVAC service, please call " +
  AMP_PHONE + ".";


// =====================================
// MOBILE NAVIGATION
// =====================================

const menuToggle = document.querySelector(".menu-toggle");

menuToggle?.addEventListener("click", () => {

  const nav = document.querySelector(".nav");

  if (!nav) return;

  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

});


// =====================================
// ADD HIDDEN FORM FIELD
// =====================================

function addHiddenField(form, name, value) {

  let field = Array.from(
    form.querySelectorAll('input[type="hidden"]')
  ).find(input => input.name === name);

  if (!field) {

    field = document.createElement("input");

    field.type = "hidden";

    field.name = name;

    form.prepend(field);

  }

  field.value = value;

}


// =====================================
// CREATE SERVICE REQUEST SUMMARY
// =====================================

function createRequestSummary(form) {

  const formData = new FormData(form);

  const lines = [
    "AMP HEATING & COOLING",
    "NEW SERVICE REQUEST",
    "--------------------------",
    ""
  ];

  for (const [key, value] of formData.entries()) {

    if (
      key.startsWith("_") ||
      key === "consent" ||
      key === "website" ||
      !String(value).trim()
    ) {
      continue;
    }

    const label = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, letter => letter.toUpperCase());

    lines.push(label + ": " + value);

  }

  lines.push("");
  lines.push("Submitted from the AMP website.");

  return lines.join("\n");

}


// =====================================
// BACKUP EMAIL OPTION
// =====================================

function addBackupEmail(form) {

  // Avoid duplicate backup links.
  if (form.querySelector(".amp-backup-email")) {
    return;
  }

  const wrapper = document.createElement("p");

  wrapper.className = "form-note amp-backup-email";

  wrapper.style.marginTop = "15px";

  const text = document.createElement("span");

  text.textContent =
    "Having trouble submitting your request? ";

  const link = document.createElement("a");

  link.textContent = "Send request by email instead";

  link.href = "mailto:" + AMP_FORM_RECIPIENT;

  link.style.fontWeight = "bold";

  link.addEventListener("click", event => {

    if (!form.reportValidity()) {

      event.preventDefault();

      return;

    }

    const subject =
      "New AMP Heating & Cooling Service Request";

    const body = createRequestSummary(form);

    link.href =
      "mailto:" + AMP_FORM_RECIPIENT +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

  });

  wrapper.append(text, link);

  const note = form.querySelector(".form-note");

  if (note) {
    note.after(wrapper);
  } else {
    form.appendChild(wrapper);
  }

}


// =====================================
// CONFIGURE SERVICE REQUEST FORMS
// =====================================

const serviceForms = document.querySelectorAll(
  "form[data-service-form]"
);

serviceForms.forEach(form => {

  // FormSubmit requires a normal POST form.
  form.method = "POST";

  form.action = AMP_FORM_ENDPOINT;

  form.setAttribute(
    "accept-charset",
    "UTF-8"
  );

  // -----------------------------------
  // EMAIL SUBJECT
  // -----------------------------------

  addHiddenField(
    form,
    "_subject",
    "NEW AMP Heating & Cooling Service Request"
  );

  // -----------------------------------
  // CUSTOMER AUTO RESPONSE
  // -----------------------------------

  addHiddenField(
    form,
    "_autoresponse",
    AMP_RESPONSE
  );

  // -----------------------------------
  // EMAIL LAYOUT
  // -----------------------------------

  addHiddenField(
    form,
    "_template",
    "table"
  );

  // -----------------------------------
  // WEBSITE SOURCE
  // -----------------------------------

  addHiddenField(
    form,
    "_url",
    window.location.href
  );

  // -----------------------------------
  // THANK YOU PAGE
  // -----------------------------------

  const thankYouURL = new URL(
    "thank-you.html",
    window.location.href
  );

  addHiddenField(
    form,
    "_next",
    thankYouURL.href
  );

  // -----------------------------------
  // CAPTCHA PROTECTION
  // -----------------------------------

  // Keep FormSubmit CAPTCHA enabled.
  // Do not set _captcha to false.

  // -----------------------------------
  // SUBMIT BUTTON
  // -----------------------------------

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  if (submitButton) {

    submitButton.textContent =
      "Send Service Request →";

  }

  // -----------------------------------
  // CUSTOMER INFORMATION
  // -----------------------------------

  const formNote = form.querySelector(
    ".form-note"
  );

  if (formNote) {

    formNote.innerHTML =
      "After successfully submitting your request, " +
      "you may receive an email confirmation. " +
      "This does not confirm an appointment. " +
      "Our team will contact you about scheduling. " +
      "For urgent service, call " +
      '<a href="tel:' + AMP_PHONE_LINK + '">' +
      AMP_PHONE +
      "</a>.";

  }

  // -----------------------------------
  // BACKUP EMAIL
  // -----------------------------------

  addBackupEmail(form);

  // -----------------------------------
  // FORM SUBMISSION
  // -----------------------------------

  form.addEventListener("submit", event => {

    if (!form.reportValidity()) {

      event.preventDefault();

      return;

    }

    // Let the browser submit directly
    // to FormSubmit using POST.
    //
    // FormSubmit handles CAPTCHA,
    // email delivery, and redirection.
    //
    // Do not claim success before the
    // service processes the request.

  });

});

// =====================================
// END OF AMP FORM SYSTEM
// =====================================

