// GitHub Pages preview only: a local FAQ assistant, with no API keys or server requests.
(()=>{const $=id=>document.getElementById(id);const launcher=$('amp-chat-launcher'),panel=$('amp-chat-panel'),close=$('amp-chat-close'),log=$('amp-chat-log'),form=$('amp-chat-form'),input=$('amp-chat-input'),suggestions=$('amp-chat-suggestions');if(!launcher||!panel||!form)return;
function open(on){panel.hidden=!on;launcher.setAttribute('aria-expanded',String(on));if(on)input.focus();else launcher.focus();}
launcher.addEventListener('click',()=>open(panel.hidden));close.addEventListener('click',()=>open(false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)open(false);});
function bubble(message,type){const el=document.createElement('div');el.className='amp-chat-message '+type;el.textContent=message;log.appendChild(el);log.scrollTop=log.scrollHeight;}
function answer(message){const s=message.toLowerCase();if(/gas smell|smell gas|carbon monoxide|co alarm|smoke|fire/.test(s))return 'For a suspected gas leak, leave the building and call 911 or your gas utility from a safe location. For carbon monoxide alarms, evacuate and call emergency services. Do not operate the HVAC system.';
if(/area|town|city|where|serve|suburb|chicago|zip/.test(s))return 'AMP serves Chicago and surrounding suburbs across the Chicagoland area. Call (224) 276-1821 to confirm service at your address.';
if(/book|request|appointment|schedule|technician|visit/.test(s))return 'You can visit the Request Service page for information. This GitHub demo cannot send or confirm bookings. For an actual appointment, please call (224) 276-1821.';
if(/price|cost|quote|estimate|fee|charge/.test(s))return 'Pricing depends on the equipment and work required. Call AMP at (224) 276-1821 for an estimate. I cannot quote a confirmed price.';
if(/ac|cool|air condition|not cold/.test(s))return 'AMP helps with AC repair, installation, and maintenance. For an AC that is not cooling, check that your thermostat is set to cool and the air filter is clean. Do not open electrical or refrigerant components. Call (224) 276-1821 for help.';
if(/furnace|heat|heater|warm/.test(s))return 'AMP helps with furnace repair, heating installation, and maintenance. Check the thermostat setting; if you suspect a safety issue, stop using the system and contact a professional. Call (224) 276-1821.';
if(/emergency|urgent|now|today/.test(s))return 'For urgent HVAC concerns, call (224) 276-1821 directly to discuss availability. This chat cannot dispatch a technician.';
return 'I can help with AMP heating and cooling services, Chicago-area service coverage, and how to request service. For a specific question or appointment, call (224) 276-1821. This is a demo FAQ assistant, not live AI.';}
function ask(message){message=message.trim();if(!message)return;bubble(message,'customer');bubble(answer(message),'assistant');input.value='';suggestions.hidden=true;input.focus();}
form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});suggestions?.querySelectorAll('button[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
})();
