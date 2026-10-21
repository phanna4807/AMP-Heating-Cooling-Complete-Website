// AMP Heating & Cooling — site navigation and service-request email integration.
// Setup: replace the placeholder below with the email inbox that should receive AMP requests.
// Example: "service@yourbusiness.com". You can replace it with FormSubmit's
// invisible-email token after the activation email arrives.
const AMP_FORM_RECIPIENT = "ampservice586@gmail.com";
const AMP_PHONE = "(224) 276-1821";
const AMP_RESPONSE =
  "Thank you for contacting AMP Heating & Cooling! We have received your " +
  "service request. Our team will review it and contact you to discuss " +
  "availability. This email is a confirmation of receipt, NOT a confirmed " +
  "appointment. For urgent HVAC issues, please call " + AMP_PHONE + ".";

const menuToggle = document.querySelector('.menu-toggle');
menuToggle?.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

function isFormConfigured() {
  const target = AMP_FORM_RECIPIENT.trim();
  return !!target && target !== 'REPLACE_WITH_AMP_BUSINESS_EMAIL' &&
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target) || /^[a-zA-Z0-9_-]{12,}$/.test(target));
}

function insertHidden(form, name, value) {
  let field = Array.from(form.querySelectorAll('input[type="hidden"]')).find(
    input => input.name === name
  );
  if (!field) {
    field = document.createElement('input');
    field.type = 'hidden';
    field.name = name;
    form.prepend(field);
  }
  field.value = value;
}

function previewRequest(form) {
  const data = new FormData(form);
  const lines = ['AMP Heating & Cooling — Service Request'];
  for (const [key, value] of data.entries()) {
    if (key.startsWith('_') || key === 'consent' || key === 'website' || !String(value).trim()) continue;
    lines.push(key.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()) + ': ' + value);
  }
  const summary = lines.join('\n');
  const alert = form.querySelector('.alert');
  if (alert) {
    alert.className = 'alert';
    alert.style.display = 'block';
    alert.textContent = 'Email delivery is not activated yet. Your request has NOT been sent. Please call ' + AMP_PHONE + ' for service or copy your request below.';
  }
  let result = form.querySelector('.amp-preview-summary');
  if (!result) {
    result = document.createElement('div');
    result.className = 'amp-preview-summary';
    result.style.cssText = 'margin-top:16px;display:grid;gap:10px';
    form.appendChild(result);
  }
  result.replaceChildren();
  const area = document.createElement('textarea');
  area.readOnly = true;
  area.rows = 7;
  area.setAttribute('aria-label', 'Request details to copy');
  area.value = summary;
  area.style.width = '100%';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'btn';
  copy.textContent = 'Copy request details';
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(summary);
      copy.textContent = 'Copied!';
    } catch (error) {
      area.select();
      try { document.execCommand('copy'); copy.textContent = 'Copied!'; }
      catch (_) { copy.textContent = 'Select and copy the text above'; }
    }
  });
  result.append(area, copy);
  alert?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

for (const form of document.querySelectorAll('form[data-service-form]')) {
  const configured = isFormConfigured();
  const button = form.querySelector('button[type="submit"]');
  const note = form.querySelector('.form-note');
  if (configured) {
    // Native POST is essential: FormSubmit's automatic customer emails do NOT
    // work with AJAX submissions or disabled reCAPTCHA.
    form.method = 'POST';
    form.action = 'https://formsubmit.co/' + encodeURIComponent(AMP_FORM_RECIPIENT.trim());
    form.setAttribute('accept-charset', 'UTF-8');
    insertHidden(form, '_subject', 'New AMP Heating & Cooling service request');
    insertHidden(form, '_autoresponse', AMP_RESPONSE);
    insertHidden(form, '_template', 'table');
    // Keep the service provider's reCAPTCHA ON; do not add _captcha=false.
    const thankYou = new URL('thank-you.html', window.location.href);
    if (thankYou.protocol === 'https:' || thankYou.protocol === 'http:') {
      insertHidden(form, '_next', thankYou.href);
    }
    if (button) button.textContent = 'Send Service Request →';
    if (note) note.innerHTML = 'We will email you a confirmation of receipt after your request is processed; this is <strong>not an appointment confirmation</strong>. You may need to complete a CAPTCHA. For urgent service call <a href="tel:2242761821">(224) 276-1821</a>.';
  } else {
    if (button) button.textContent = 'Prepare request details →';
    if (note) note.innerHTML = 'Email delivery has not been set up yet, so this form cannot send requests. For service, call <a href="tel:2242761821">(224) 276-1821</a>. Do not enter sensitive information in the preview.';
  }

  form.addEventListener('submit', event => {
    if (!form.reportValidity()) { event.preventDefault(); return; }
    if (!configured) {
      event.preventDefault();
      previewRequest(form);
      return;
    }
    // Native browser submit to FormSubmit. Never show success here because the
    // email provider must accept the submission first.
  });
}
