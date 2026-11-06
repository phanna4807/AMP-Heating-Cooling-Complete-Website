
/*
 AMP HEATING & COOLING
 Website Service Request System

 Website: https://www.7-amp.com
 Phone: (630) 380-1017
 Email: ampservice586@gmail.com

 Form Provider: Web3Forms
*/

// =====================================
// BUSINESS SETTINGS
// =====================================

const AMP_EMAIL = "ampservice586@gmail.com";

const AMP_PHONE = "(630) 380-1017";

const AMP_PHONE_LINK = "6303801017";

// Your Web3Forms Access Key
const AMP_ACCESS_KEY =
  "b53d4ad3-5fc3-40a4-91cc-e14b24d29dcb";

// Web3Forms API
const AMP_FORM_ENDPOINT =
  "https://api.web3forms.com/submit";


// =====================================
// MOBILE NAVIGATION
// =====================================

const menuToggle =
  document.querySelector(".menu-toggle");

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
// DISPLAY FORM MESSAGES
// =====================================

function showFormMessage(form, message, success) {

  let alertBox = form.querySelector(".alert");

  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.className = "alert";
    alertBox.setAttribute("role", "status");
    alertBox.setAttribute("aria-live", "polite");
    form.prepend(alertBox);
  }

  alertBox.style.display = "block";

  alertBox.style.padding = "14px";

  alertBox.style.marginBottom = "15px";

  alertBox.style.borderRadius = "8px";

  alertBox.style.backgroundColor = success
    ? "#e8f8ee"
    : "#fff0f0";

  alertBox.style.color = success
    ? "#146c35"
    : "#a12323";

  alertBox.textContent = message;

  alertBox.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}


// =====================================
// ADD BACKUP EMAIL OPTION
// =====================================

function addBackupEmail(form) {

  if (form.querySelector(".amp-backup-email")) {
    return;
  }

  const wrapper = document.createElement("p");

  wrapper.className =
    "form-note amp-backup-email";

  wrapper.style.marginTop = "15px";

  const text = document.createElement("span");

  text.textContent =
    "Having trouble submitting your request? ";

  const link = document.createElement("a");

  link.textContent = "Email AMP directly";

  link.href = "mailto:" + AMP_EMAIL;

  link.style.fontWeight = "bold";

  wrapper.append(text, link);

  form.appendChild(wrapper);

}


// =====================================
// CONFIGURE SERVICE REQUEST FORMS
// =====================================

const serviceForms =
  document.querySelectorAll(
    "form[data-service-form]"
  );

serviceForms.forEach(form => {

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  const formNote = form.querySelector(
    ".form-note"
  );

  // Replace the old FormSubmit destination
  form.action = AMP_FORM_ENDPOINT;

  form.method = "POST";

  if (submitButton) {
    submitButton.textContent =
      "Send Service Request →";
  }

  if (formNote) {
    formNote.innerHTML =
      "After submitting your request, " +
      "AMP will contact you to discuss scheduling. " +
      "Submitting this form does not confirm " +
      "an appointment. For urgent service, call " +
      '<a href="tel:' + AMP_PHONE_LINK + '">' +
      AMP_PHONE +
      "</a>.";
  }

  addBackupEmail(form);


  // ===================================
  // SEND REQUEST TO WEB3FORMS
  // ===================================

  form.addEventListener("submit", async event => {

    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    if (submitButton?.disabled) {
      return;
    }

    const formData = new FormData(form);

    // Existing spam-trap field
    const honey = String(
      formData.get("_honey") || ""
    ).trim();

    if (honey) {
      showFormMessage(
        form,
        "Unable to process this request.",
        false
      );
      return;
    }

    // Read the customer's details
    const requestData = {

      access_key: AMP_ACCESS_KEY,

      subject:
        "NEW AMP Heating & Cooling Service Request",

      from_name:
        "AMP Heating & Cooling Website",

      name: String(
        formData.get("name") || ""
      ).trim(),

      phone: String(
        formData.get("phone") || ""
      ).trim(),

      email: String(
        formData.get("email") || ""
      ).trim(),

      city: String(
        formData.get("city") || ""
      ).trim(),

      service: String(
        formData.get("service") || ""
      ).trim(),

      message: String(
        formData.get("message") || ""
      ).trim(),

      consent: formData.get("consent") === "yes"
        ? "Yes"
        : "No",

      source:
        "AMP Heating & Cooling Website"

    };

    const originalButtonText =
      submitButton?.textContent ||
      "Send Service Request";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent =
        "Sending Request...";
    }

    try {

      const response = await fetch(
        AMP_FORM_ENDPOINT,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },

          body: JSON.stringify(requestData)
        }
      );

      const result = await response.json();

      // =================================
      // SUCCESS
      // =================================

      if (response.ok && result.success === true) {

        showFormMessage(
          form,
          "Thank you! Your service request " +
          "has been submitted successfully. " +
          "AMP Heating & Cooling will review " +
          "your information and contact you " +
          "about scheduling.",
          true
        );

        // Clear the form only on success
        form.reset();

      } else {

        // =================================
        // WEB3FORMS REPORTED AN ERROR
        // =================================

        showFormMessage(
          form,
          "Your request could not be submitted. " +
          "Please try again or call AMP at " +
          AMP_PHONE + ". " +
          (result.message || ""),
          false
        );

      }

    } catch (error) {

      // ===================================
      // NETWORK OR CONNECTION ERROR
      // ===================================

      console.error(
        "AMP service request error:",
        error
      );

      showFormMessage(
        form,
        "We could not connect to the form service. " +
        "Your request has NOT been confirmed. " +
        "Please try again, email " +
        AMP_EMAIL +
        ", or call " +
        AMP_PHONE + ".",
        false
      );

    } finally {

      // Restore the submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
          originalButtonText;
      }

    }

  });

});

// =====================================
// END OF AMP WEBSITE SCRIPT
// =====================================
