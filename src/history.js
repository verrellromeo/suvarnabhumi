import {history, historyEras} from './data.js';
import {escapeHTML as e} from './components.js';
import {chronicleSource, preNarratives} from './history-narratives.js';

const preEraId = 'pre-suvarnabhumi';
const eras = [...historyEras, {id:'origins', title:'Before the Union', date:'683', events:[history[0]]}];
const art = ['./assets/history/river-template.svg','./assets/history/court-template.svg','./assets/history/voyage-template.svg'];
const orderedEvents = era => era.events.map((event, index) => ({...event, index}))
  .sort((a,b) => parseInt(a.date.replace(/^c\. /,''),10) - parseInt(b.date.replace(/^c\. /,''),10));
const ornament = '<div class="scroll-ornament" aria-hidden="true"><span>✺</span></div>';

function chapters(era) {
  return orderedEvents(era).map((event, position) => {
    const id = `scroll-${era.id}-${event.index}`;
    const sections = era.id === preEraId ? preNarratives[`1.${event.index + 1}`] : [{title:'In the imperial record',paragraphs:[event.body]}];
    return `<article class="scroll-event ${position % 2 ? 'scroll-event--dark' : ''}" id="${id}" data-scroll-event="${position}">
      <details class="scroll-story" ${position === 0 ? 'open' : ''}>
        <summary class="scroll-preview" aria-controls="${id}-body">
          <span class="scroll-chapter">ACCOUNT ${String(position+1).padStart(2,'0')} <span aria-hidden="true">|</span> ${e(era.title)}</span>
          <span class="scroll-event-grid"><time class="scroll-year ${event.date.includes('–') ? 'scroll-year--range' : ''}">${event.date.split('–').map((part,i)=>`<span>${i ? '–' : ''}${e(part)}</span>`).join('')}</time><span class="scroll-event-copy"><h2>${e(event.title)}</h2><span class="scroll-place">${e(event.place || 'Imperial chronicle')}</span><span class="scroll-deck">${e(event.body)}</span><span class="scroll-read"><span class="when-closed">Continue reading ↓</span><span class="when-open">Collapse story ↑</span></span></span></span>
          <span class="scroll-art"><img src="${art[position % art.length]}" alt="" loading="lazy"><span class="scroll-art-label">Illustration placeholder</span></span>
        </summary>
        <div class="scroll-story-body" id="${id}-body">
          ${ornament}<div class="scroll-prose">${(sections || []).map((section,i) => `<section class="scroll-prose-section">${i === 1 ? `<figure class="scroll-inset"><img src="${art[(position+1)%art.length]}" loading="lazy" alt="Decorative landscape template"><figcaption>Illustration placeholder · ${e(event.place || era.title)}</figcaption></figure>` : ''}<h3>${e(section.title)}</h3>${section.paragraphs.map(p=>`<p>${e(p)}</p>`).join('')}</section>`).join('')}</div>
          <div class="scroll-end"><a href="${chronicleSource}" target="_blank" rel="noopener noreferrer">From the Suvarnabhumi Grand Timeline ↗</a><button type="button" data-collapse-story>Collapse story ↑</button></div>${ornament}
        </div>
      </details>
    </article>`;
  }).join('');
}

function eraContent(era) {
  const count = era.events.length;
  return `<header class="scroll-hero"><img src="${art[0]}" alt="" class="scroll-hero-art"><div class="scroll-hero-inner"><div><p class="scroll-kicker">THE IMPERIAL CHRONICLE</p><h1 tabindex="-1">${e(era.title)}</h1><p class="scroll-era-dates">${e(era.date)}</p>${ornament}</div><p class="scroll-era-intro">${e(era.summary || 'Follow the turning points, alliances and ambitions that shaped the next age of Suvarnabhumi.')}</p></div><span class="scroll-art-label">Illustration placeholder</span></header>
    <div class="scroll-tools"><p>${count ? `${count} historical ${count === 1 ? 'account' : 'accounts'} · Read at your own pace` : 'The chronicle continues'}</p>${count ? `<label>Jump to event <select data-scroll-jump aria-label="Jump to event"><option value="">Choose an event…</option>${orderedEvents(era).map(event=>`<option value="scroll-${era.id}-${event.index}">${e(event.date)} — ${e(event.title)}</option>`).join('')}</select></label>` : ''}</div>
    ${count ? chapters(era) : `<div class="scroll-empty">${ornament}<h2>A new age awaits</h2><p>The detailed accounts of this era are still being prepared.</p><button type="button" data-return-pre>Return to Pre-Suvarnabhumi</button></div>`}`;
}

export function historyPage() {
  return `<div class="history-scroll"><nav class="scroll-era-bar" aria-label="Explore history by era"><span class="scroll-explore">EXPLORE BY ERA</span><div class="scroll-era-options">${eras.map((era,i)=>`<button type="button" data-scroll-era="${e(era.id)}" title="${e(era.title)} · ${e(era.date)}" aria-pressed="${i===0}"><strong>${e(era.title)}</strong><span>${e(era.date)}</span></button>`).join('')}</div><div class="scroll-progress"><span>READING PROGRESS</span><output data-scroll-progress>1 of 22</output><progress max="22" value="1" aria-label="Current historical account"></progress></div></nav><div data-scroll-content>${eraContent(eras[0])}</div></div>`;
}

export function mountHistory(root) {
  const content = root.querySelector('[data-scroll-content]');
  const eraButtons = [...root.querySelectorAll('[data-scroll-era]')];
  const progress = root.querySelector('.scroll-progress progress');
  const output = root.querySelector('[data-scroll-progress]');
  const controller = new AbortController();
  let observer;
  let currentEra = eras[0];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function trackEvents() {
    observer?.disconnect();
    progress.max = currentEra.events.length || 1;
    progress.value = currentEra.events.length ? 1 : 0;
    output.textContent = currentEra.events.length ? `1 of ${currentEra.events.length}` : 'Coming soon';
    observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
      if (!visible) return;
      const position = Number(visible.target.dataset.scrollEvent)+1;
      progress.value = position;
      output.textContent = `${position} of ${currentEra.events.length}`;
    }, {rootMargin:'-20% 0px -50% 0px', threshold:0});
    content.querySelectorAll('[data-scroll-event]').forEach(item=>observer.observe(item));
  }
  function selectEra(id) {
    const era = eras.find(item=>item.id===id);
    if (!era) return;
    currentEra = era;
    eraButtons.forEach(button=>button.setAttribute('aria-pressed', String(button.dataset.scrollEra===id)));
    content.innerHTML = eraContent(era);
    trackEvents();
    const heading=content.querySelector('h1');
    heading.focus({preventScroll:true});
    heading.scrollIntoView({block:'center',behavior:reduced.matches?'instant':'smooth'});
  }
  root.addEventListener('click', event=>{
    const eraButton=event.target.closest('[data-scroll-era]');
    if (eraButton) selectEra(eraButton.dataset.scrollEra);
    if (event.target.closest('[data-return-pre]')) selectEra(preEraId);
    const collapse=event.target.closest('[data-collapse-story]');
    if (collapse) {
      const details=collapse.closest('details');
      details.open=false;
      details.querySelector('summary').focus({preventScroll:true});
      details.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
    }
  },{signal:controller.signal});
  root.addEventListener('change',event=>{
    if (!event.target.matches('[data-scroll-jump]') || !event.target.value) return;
    const article=document.getElementById(event.target.value);
    if (!article) return;
    article.querySelector('details').open=true;
    article.querySelector('summary').focus({preventScroll:true});
    article.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
  },{signal:controller.signal});
  trackEvents();
  return ()=>{controller.abort();observer?.disconnect();};
}
