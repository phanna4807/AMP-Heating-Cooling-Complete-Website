
/*
 AMP Heating & Cooling
 Navigation and service request forms
 Business phone: (630) 380-1017
*/

// Business contact information
const AMP_FORM_RECIPIENT = "ampservice586@gmail.com";
const AMP_PHONE = "(630) 380-1017";
const AMP_PHONE_TEL = "6303801017";

// Customer confirmation message
const AMP_RESPONSE =
  "Thank you for contacting AMP Heating & Cooling! " +
  "We have received your service request. " +
  "Our team will review your information and contact you " +
  "to discuss scheduling and availability. " +
  "This is not a confirmed appointment. " +
  "For urgent HVAC service, call " + AMP_PHONE + ".";


// ------------------------------------
// MOBILE NAVIGATION
// ------------------------------------

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


// ------------------------------------
// CHECK FORM CONFIGURATION
// ------------------------------------

function isFormConfigured() {
  const target = AMP_FORM_RECIPIENT.trim();

  return (
    target.length > 0 &&
    target !== "REPLACE_WITH_AMP_BUSINESS_EMAIL" &&
    (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target) ||
      /^[a-zA-Z0-9_-]{12,}$/.test(target)
    )
  );
}


// ------------------------------------
// INSERT HIDDEN FORM FIELDS
// ------------------------------------

function insertHidden(form, name, value) {
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


// ------------------------------------
// FORMAT CUSTOMER REQUEST
// ------------------------------------

function buildRequestSummary(form) {
  const data = new FormData(form);

  const lines = [
    "AMP Heating & Cooling",
    "New Service Request",
    ""
  ];

  for (const [key, value] of data.entries()) {
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

  return lines.join("\n");
}


// ------------------------------------
// PREVIEW WHEN FORM IS UNCONFIGURED
// ------------------------------------

function previewRequest(form) {
  const summary = buildRequestSummary(form);
  const alert = form.querySelector(".alert");

  if (alert) {
    alert.className = "alert";
    alert.style.display = "block";
    alert.textContent =
      "Email delivery is not configured. " +
      "Your request has NOT been sent. " +
      "Please call " + AMP_PHONE + " for service.";
  }

  let result = form.querySelector(".amp-preview-summary");

  if (!result) {
    result = document.createElement("div");
    result.className = "amp-preview-summary";
    result.style.cssText =
      "margin-top:16px;display:grid;gap:10px";

    form.appendChild(result);
  }

  result.replaceChildren();

  const area = document.createElement("textarea");
  area.readOnly = true;
  area.rows = 7;
  area.style.width = "100%";
  area.setAttribute(
    "aria-label",
    "Request details to copy"
  );
  area.value = summary;

  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "btn";
  copy.textContent = "Copy request details";

  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(summary);
      copy.textContent = "Copied!";
    } catch (error) {
      area.select();
      try {
        document.execCommand("copy");
        copy.textContent = "Copied!";
      } catch (_) {
        copy.textContent = "Select and copy the text above";
      }
    }
  });

  result.append(area, copy);

  alert?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// ------------------------------------
// BACKUP EMAIL OPTION
// ------------------------------------

function addBackupEmailOption(form) {
  const note = form.querySelector(".form-note");

  if (!note || !isFormConfigured()) return;

  const wrapper = document.createElement("p");
  wrapper.className = "form-note";

  const description = document.createElement("span");
  description.textContent =
    "Having trouble sending your request? ";

  const emailButton = document.createElement("a");
  emailButton.className = "text-link";
  emailButton.textContent = "Open email app instead";

  emailButton.href =
    "mailto:" + AMP_FORM_RECIPIENT;

  emailButton.addEventListener("click", event => {
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    const subject =
      "New AMP Heating & Cooling Service Request";

    const body = buildRequestSummary(form);

    emailButton.href =
      "mailto:" + AMP_FORM_RECIPIENT +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });

  const explanation = document.createElement("span");
  explanation.textContent =
    " This opens an email draft. " +
    "You must send the email from your email app.";

  wrapper.append(
    description,
    emailButton,
    explanation
  );

  note.after(wrapper);
}


// ------------------------------------
// CONFIGURE SERVICE REQUEST FORMS
// ------------------------------------

for (
  const form of document.querySelectorAll(
    "form[data-service-form]"
  )
) {
  const configured = isFormConfigured();

  const button = form.querySelector(
    'button[type="submit"]'
  );

  const note = form.querySelector(".form-note");

  if (configured) {

    // Configure FormSubmit
    form.method = "POST";

    form.action =
      "https://formsubmit.co/" +
      encodeURIComponent(
        AMP_FORM_RECIPIENT.trim()
      );

    form.setAttribute(
      "accept-charset",
      "UTF-8"
    );

    insertHidden(
      form,
      "_subject",
      "New AMP Heating & Cooling service request"
    );

    insertHidden(
      form,
      "_autoresponse",
      AMP_RESPONSE
    );

    insertHidden(
      form,
      "_template",
      "table"
    );

    // Keep FormSubmit's CAPTCHA enabled.

    const thankYou = new URL(
      "thank-you.html",
      window.location.href
    );

    if (
      thankYou.protocol === "https:" ||
      thankYou.protocol === "http:"
    ) {
      insertHidden(
        form,
        "_next",
        thankYou.href
      );
    }

    if (button) {
      button.textContent =
        "Send Service Request →";
    }

    if (note) {
      note.innerHTML =
        "After your request is processed, " +
        "you may receive an email confirmation. " +
        "This is not a confirmed appointment. " +
        "For urgent service, call " +
        '<a href="tel:' + AMP_PHONE_TEL + '">' +
        AMP_PHONE +
        "</a>.";
    }

    // Add another way to contact AMP
    addBackupEmailOption(form);

  } else {

    if (button) {
      button.textContent =
        "Prepare request details →";
    }

    if (note) {
      note.innerHTML =
        "Online email delivery is not configured. " +
        "Please call " +
        '<a href="tel:' + AMP_PHONE_TEL + '">' +
        AMP_PHONE +
        "</a> for service.";
    }
  }

  // Handle form submission
  form.addEventListener("submit", event => {

    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    if (!configured) {
      event.preventDefault();
      previewRequest(form);
      return;
    }

    // Native POST request to FormSubmit.
    // Do not display success until the
    // provider processes the submission.
  });
}

