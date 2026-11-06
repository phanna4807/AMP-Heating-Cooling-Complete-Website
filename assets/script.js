
/*
 AMP HEATING & COOLING
 Website Service Request System
 Provider: Web3Forms
 Phone: (630) 380-1017
 Email: ampservice586@gmail.com
*/

(() => {
  "use strict";

  // BUSINESS SETTINGS

  const ACCESS_KEY =
    "b53d4ad3-5fc3-40a4-91cc-e14b24d29dcb";

  const ENDPOINT =
    "https://api.web3forms.com/submit";

  const EMAIL = "ampservice586@gmail.com";

  const PHONE = "(630) 380-1017";

  const PHONE_LINK = "6303801017";

  // MOBILE MENU

  const menuToggle =
    document.querySelector(".menu-toggle");

  menuToggle?.addEventListener("click", () => {
    const nav = document.querySelector(".nav");

    if (!nav) return;

    const open = nav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(open)
    );
  });

  // DISPLAY SUCCESS OR ERROR MESSAGE

  function showStatus(form, message, success) {
    let status = form.querySelector(".alert");

    if (!status) {
      status = document.createElement("div");
      status.className = "alert";
      form.prepend(status);
    }

    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    status.style.display = "block";
    status.style.padding = "14px";
    status.style.margin = "0 0 16px";
    status.style.borderRadius = "8px";

    status.style.background = success
      ? "#e9f7ed"
      : "#fff0f0";

    status.style.color = success
      ? "#145b2e"
      : "#9b2323";

    status.textContent = message;

    status.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  // ADD HIDDEN FIELDS

  function addHidden(form, name, value) {
    let field = form.querySelector(
      `input[type="hidden"][name="${name}"]`
    );

    if (!field) {
      field = document.createElement("input");
      field.type = "hidden";
      field.name = name;
      form.prepend(field);
    }

    field.value = value;
  }

  // BACKUP EMAIL OPTION

  function addEmailBackup(form) {
    if (form.querySelector(".amp-email-backup")) {
      return;
    }

    const text = document.createElement("p");
    text.className = "form-note amp-email-backup";

    const link = document.createElement("a");

    link.textContent = "Email your request instead";
    link.href = `mailto:${EMAIL}`;

    link.addEventListener("click", () => {
      const data = new FormData(form);

      const body = [
        "AMP Heating & Cooling - Service Request",
        ""
      ];

      const keys = [
        "name",
        "phone",
        "email",
        "city",
        "service",
        "message"
      ];

      for (const key of keys) {
        body.push(
          `${key.toUpperCase()}: ` +
          String(data.get(key) || "")
        );
      }

      link.href =
        `mailto:${EMAIL}` +
        `?subject=${encodeURIComponent(
          "AMP Service Request"
        )}` +
        `&body=${encodeURIComponent(
          body.join("\n")
        )}`;
    });

    text.append(
      "If the form cannot be sent, ",
      link,
      ". You must press Send in your email app."
    );

    form.appendChild(text);
  }

  // SET UP ALL SERVICE REQUEST FORMS

  document.querySelectorAll(
    "form[data-service-form]"
  ).forEach(form => {

    // REPLACE FORMSUBMIT WITH WEB3FORMS

    form.action = ENDPOINT;
    form.method = "POST";

    addHidden(
      form,
      "access_key",
      ACCESS_KEY
    );

    addHidden(
      form,
      "subject",
      "New AMP Heating & Cooling Service Request"
    );

    addHidden(
      form,
      "from_name",
      "AMP Heating & Cooling Website"
    );

    const button = form.querySelector(
      'button[type="submit"]'
    );

    const note = form.querySelector(
      ".form-note"
    );

    if (button) {
      button.textContent =
        "Send Service Request →";
    }

    if (note) {
      note.textContent =
        "Submitting a request does not " +
        "confirm an appointment. " +
        "For urgent service, call ";

      const call = document.createElement("a");
      call.href = `tel:${PHONE_LINK}`;
      call.textContent = PHONE;

      note.append(call, ".");
    }

    addEmailBackup(form);

    // SUBMIT REQUEST USING WEB3FORMS

    form.addEventListener(
      "submit",
      async event => {

        // Prevent old FormSubmit navigation
        event.preventDefault();

        if (!form.reportValidity()) {
          return;
        }

        if (form.dataset.sending === "yes") {
          return;
        }

        const fields = new FormData(form);

        // Existing spam protection
        const honey = String(
          fields.get("_honey") || ""
        ).trim();

        if (honey) {
          return;
        }

        // CUSTOMER INFORMATION

        const data = {
          access_key: ACCESS_KEY,

          subject:
            "New AMP Heating & Cooling Service Request",

          from_name:
            "AMP Heating & Cooling Website",

          name: String(
            fields.get("name") || ""
          ).trim(),

          phone: String(
            fields.get("phone") || ""
          ).trim(),

          email: String(
            fields.get("email") || ""
          ).trim(),

          city: String(
            fields.get("city") || ""
          ).trim(),

          service: String(
            fields.get("service") || ""
          ).trim(),

          message: String(
            fields.get("message") || ""
          ).trim(),

          consent: fields.get("consent")
            ? "Yes"
            : "No"
        };

        // DISABLE BUTTON WHILE SENDING

        form.dataset.sending = "yes";

        if (button) {
          button.disabled = true;
          button.textContent = "Sending...";
        }

        try {
          const response = await fetch(
            ENDPOINT,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },

              body: JSON.stringify(data)
            }
          );

          const result = await response.json();

          // SUCCESS

          if (
            response.ok &&
            result.success === true
          ) {
            showStatus(
              form,
              "Your service request was accepted! " +
              "AMP Heating & Cooling will contact " +
              "you about scheduling. " +
              "This is not an appointment confirmation.",
              true
            );

            form.reset();

          } else {

            // PROVIDER ERROR

            showStatus(
              form,
              "Your request was not sent. " +
              (result.message || "Please try again.") +
              " You can also call " + PHONE + ".",
              false
            );
          }

        } catch (error) {

          // CONNECTION ERROR

          console.error(
            "AMP Web3Forms error:",
            error
          );

          showStatus(
            form,
            "The request could not be sent. " +
            "Please try again, email " +
            EMAIL +
            ", or call " + PHONE + ".",
            false
          );

        } finally {

          form.dataset.sending = "no";

          if (button) {
            button.disabled = false;
            button.textContent =
              "Send Service Request →";
          }
        }
      }
    );
  });
})();

// =====================================
// END OF AMP WEBSITE SCRIPT
// =====================================
