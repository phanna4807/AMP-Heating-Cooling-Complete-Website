// GitHub Pages static preview: website requests cannot be delivered from here.
const toggle=document.querySelector('.menu-toggle');
toggle?.addEventListener('click',()=>{const nav=document.querySelector('.nav');const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
for(const form of document.querySelectorAll('form[data-service-form]')){
  const btn=form.querySelector('button[type="submit"]');if(btn) btn.textContent='Prepare request details →';
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const info=new FormData(form), lines=['AMP Heating & Cooling — Service Request'];
    for(const [key,value] of info.entries()){if(key==='website'||key==='consent'||!String(value).trim())continue;lines.push(key.replace(/_/g,' ').replace(/\b\w/g,x=>x.toUpperCase())+': '+value);}
    const summary=lines.join('\n');let alert=form.querySelector('.alert');
    alert.className='alert';alert.style.display='block';alert.textContent='This is a website preview. Your request has NOT been sent to AMP. Copy the details below and call (224) 276-1821 to arrange service.';
    let result=form.querySelector('.amp-preview-summary');
    if(!result){result=document.createElement('div');result.className='amp-preview-summary';result.style.cssText='margin-top:16px;display:grid;gap:10px';form.appendChild(result);}
    result.replaceChildren();const area=document.createElement('textarea');area.readOnly=true;area.rows=7;area.setAttribute('aria-label','Request details to copy');area.value=summary;area.style.width='100%';
    const copy=document.createElement('button');copy.type='button';copy.className='btn';copy.textContent='Copy request details';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary);copy.textContent='Copied!';}catch{area.select();document.execCommand('copy');copy.textContent='Copied!';}});
    result.append(area,copy);alert.scrollIntoView({behavior:'smooth',block:'center'});
  });
}
