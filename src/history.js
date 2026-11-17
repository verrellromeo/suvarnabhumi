import {history, historyEras} from './data.js';
import {escapeHTML as e, eyebrow} from './components.js';
import {chronicleSource, preOverview, preNarratives} from './history-narratives.js';

const preEraId = 'pre-suvarnabhumi';
const orderedEvents = era => era.events.map((event, index) => ({...event, index}))
  .sort((a, b) => parseInt(a.date.replace(/^c\. /, ''), 10) - parseInt(b.date.replace(/^c\. /, ''), 10));

function eventButton(event, key) {
  return `<div class="history-event" data-event-marker="${e(key)}"><button type="button" class="history-event-button" data-history-event="${e(key)}" aria-controls="history-reader" aria-expanded="false"><time>${e(event.date)}</time><strong>${e(event.title)}</strong><span class="history-event__place">${e(event.place || 'Imperial chronicle')}</span><span class="history-toggle" aria-hidden="true">+</span></button></div>`;
}

export function historyTimeline() {
  return eventButton(history[0], 'founding') + historyEras.map(era => {
    const count = era.events.length;
    return `<details class="history-entry history-era" id="era-${e(era.id)}" data-history-era="${e(era.id)}"><summary><time>${e(era.date)}</time><strong>${e(era.title)}</strong><span class="history-era__hint">${count ? `${count} ${count === 1 ? 'event' : 'events'}` : 'Chronicle to follow'}</span><span class="history-toggle" aria-hidden="true">+</span></summary><div class="history-era__content">${count ? `<div class="history-events">${orderedEvents(era).map(event => eventButton(event, `${era.id}:${event.index}`)).join('')}</div>` : '<p class="history-empty">The dated accounts of this era will follow.</p>'}</div></details>`;
  }).join('');
}

function prose(sections) {
  return sections.map(section => `<section class="chronicle-section"><h3>${e(section.title)}</h3>${section.paragraphs.map(paragraph => `<p>${e(paragraph)}</p>`).join('')}</section>`).join('');
}

function welcome() {
  return `${eyebrow('THE IMPERIAL CHRONICLE')}<h2 id="history-reader-title" tabindex="-1">A realm unfolding</h2><p class="chronicle-deck">A broken dynasty. A returning exile. A maritime world learning to call itself one realm.</p><div class="chronicle-opening"><span>01</span><p>Open <strong>Pre-Suvarnabhumi</strong> to enter the first age. Choose a dated event on the timeline to read its story here.</p></div><p class="history-reading-note">The first era contains twenty-two narrative accounts, from the Royal Massacre of 1017 to the dynastic alliance of 1072.</p>`;
}

export function historyReader() {
  return `<aside class="history-feature history-reader" id="history-reader" aria-labelledby="history-reader-title">${welcome()}</aside>`;
}

export function mountHistory(root) {
  const layout = root.querySelector('.history-layout');
  const reader = root.querySelector('#history-reader');
  const buttons = [...root.querySelectorAll('[data-history-event]')];
  let activeKey = null;
  let activeEraId = null;

  function markSelection() {
    for (const button of buttons) {
      const selected = button.dataset.historyEvent === activeKey;
      button.setAttribute('aria-expanded', String(selected));
      button.closest('.history-event').classList.toggle('is-active', selected);
    }
  }

  function reset() {
    activeKey = null;
    activeEraId = null;
    markSelection();
    layout.classList.remove('is-reading');
    reader.innerHTML = welcome();
    reader.scrollTop = 0;
  }

  function display({date, title, subtitle, sections, footer = '', onBack, focus = false}) {
    layout.classList.add('is-reading');
    reader.innerHTML = `<div class="chronicle-toolbar"><span class="overline">${e(date)}</span><button type="button" class="chronicle-close" data-reader-close aria-label="Close historical account">Close <span aria-hidden="true">×</span></button></div>${eyebrow(subtitle)}<h2 id="history-reader-title" tabindex="-1">${e(title)}</h2><div class="chronicle-rule" aria-hidden="true"></div>${prose(sections)}${footer}<p class="chronicle-source">Based on the <a href="${chronicleSource}" target="_blank" rel="noopener noreferrer">Suvarnabhumi Grand Timeline ↗</a></p>`;
    reader.scrollTop = 0;
    reader.querySelector('[data-reader-close]').addEventListener('click', () => {
      const previous = activeKey;
      reset();
      if (previous) buttons.find(button => button.dataset.historyEvent === previous)?.focus({preventScroll:true});
    });
    if (onBack) reader.querySelector('[data-reader-overview]')?.addEventListener('click', onBack);
    if (focus) {
      reader.querySelector('h2').focus({preventScroll:true});
      // On a narrow screen the reader comes first; move to the newly opened story.
      if (window.matchMedia('(max-width: 690px)').matches) reader.scrollIntoView({block:'start', behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  }

  function showEra(era, focus = false) {
    activeKey = null;
    activeEraId = era.id;
    markSelection();
    display({date:era.date, title:era.title, subtitle:'ERA OVERVIEW', sections:era.id === preEraId ? preOverview : [{title:'The next age', paragraphs:[era.summary || 'The narrative chronicle of this era will follow. Its available dated events can already be explored on the timeline.']}], focus});
  }

  function showEvent(key) {
    if (activeKey === key) {
      const era = historyEras.find(item => item.id === activeEraId);
      if (era) showEra(era); else reset();
      return;
    }
    let event, era, canonId;
    if (key === 'founding') event = history[0];
    else {
      const [eraId, index] = key.split(':');
      era = historyEras.find(item => item.id === eraId);
      event = era?.events[Number(index)];
      if (eraId === preEraId) canonId = `1.${Number(index) + 1}`;
    }
    if (!event) return;
    activeKey = key;
    activeEraId = era?.id || null;
    markSelection();
    const sections = canonId ? preNarratives[canonId] : [{title:'In the imperial record', paragraphs:[event.body]}];
    display({date:event.date, title:event.title, subtitle:era ? `${era.title}${canonId ? ' / ' + canonId : ''}` : 'BEFORE THE UNION', sections,
      footer:era ? '<button type="button" class="chronicle-back" data-reader-overview>← Return to era overview</button>' : '',
      onBack:era ? () => showEra(era, true) : null, focus:true});
  }

  for (const button of buttons) button.addEventListener('click', () => showEvent(button.dataset.historyEvent));
  for (const detail of root.querySelectorAll('[data-history-era]')) {
    detail.addEventListener('toggle', () => {
      const era = historyEras.find(item => item.id === detail.dataset.historyEra);
      if (detail.open) showEra(era);
      else if (activeEraId === era.id) reset();
    });
  }
}
