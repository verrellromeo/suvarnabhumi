import { settlementMap, mountSettlementMap } from "./settlement-map.js";
import { breadcrumb, button, escapeHTML as e, image } from "./components.js";

export function settlementDetail(city) {
  const hasMap = city.id === "maharajapura";
  const hero = city.hero ?? { src: city.image, alt: "", placeholder: true };
  const facts = city.facts ?? [
    { label: "Administrative setting", value: city.region },
    { label: "Character", value: city.type },
    { label: "Historical note", value: city.era }
  ];
  const feature = city.feature;
  const sections = [
    ["Overview", `<div class="settlement-overview${feature ? "" : " settlement-overview--compact"}">
      <aside class="settlement-facts">
        <h2>At a glance</h2>
        <dl>${facts.map(({label, value}) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join("")}</dl>
      </aside>
      <div class="settlement-copy">
        <h2>${e(city.overviewTitle ?? `The character of ${city.name}`)}</h2>
        <p>${e(city.summary)}</p>
        <p>${e(city.detail)}</p>
      </div>
      ${feature ? `<figure class="settlement-feature">
        <h2>${e(feature.title)}</h2>
        ${image(feature.src, feature.alt)}
      </figure>` : ""}
    </div>`],
    ["History", city.history ? renderSection("History", city.history) : ""],
    ["Districts", city.districts?.length ? renderSection("Districts", city.districts) : ""],
    ["Landmarks", (city.landmarks ?? city.features)?.length
      ? renderSection("Landmarks & points of interest", city.landmarks ?? city.features) : ""],
    ["Map", hasMap ? settlementMap() : ""],
    ["Gallery", city.gallery?.length ? `<div class="settlement-gallery">${city.gallery.map((photo, index) =>
      `<figure id="settlement-photo-${index}" tabindex="-1">${image(photo.src, photo.alt)}${photo.caption ? `<figcaption>${e(photo.caption)}</figcaption>` : ""}</figure>`
    ).join("")}</div>` : ""]
  ].filter(([, content]) => content);

  const initialTab = hasMap ? sections.findIndex(([label]) => label === "Map") : 0;

  return `<article class="settlement-detail${hasMap ? " settlement-detail--atlas" : ""}">
    <header class="settlement-panorama">
      <img src="${e(hero.src)}" alt="${e(hero.alt)}" fetchpriority="high">
      <div class="container settlement-panorama__copy">
        ${breadcrumb(hasMap
          ? [{label: "Suvarnabhumi", href: "#/"}, {label: "Cakravala", href: "#/regions"}, {label: "Batam"}]
          : [{label: "Settlements", href: "#/settlements"}, {label: city.name}])}
        <h1>${e(city.name)}</h1>
        <p>${e(city.subtitle ?? `${city.type} · ${city.region}`)}</p>
      </div>
    </header>
    <div class="settlement-tabs">
      <div class="container" role="tablist" aria-label="Settlement sections">
        ${sections.map(([label], index) => `<button type="button" role="tab" id="settlement-tab-${index}"
          aria-controls="settlement-panel-${index}" aria-selected="${index === initialTab}"
          tabindex="${index === initialTab ? 0 : -1}">${label}</button>`).join("")}
      </div>
    </div>
    <div class="container settlement-body">
      ${sections.map(([label, content], index) => `<section role="tabpanel" id="settlement-panel-${index}"
        aria-labelledby="settlement-tab-${index}" data-section="${label}" tabindex="0"${index === initialTab ? "" : " hidden"}>${content}</section>`).join("")}
      <div class="settlement-body__footer">
        ${hero.placeholder ? "<p>Banner photograph is an editorial placeholder.</p>" : ""}
        ${button("All settlements", "#/settlements")}
      </div>
    </div>
  </article>`;
}

function renderSection(title, entries) {
  return `<div class="settlement-copy settlement-section">
    <h2>${title}</h2>
    ${Array.isArray(entries)
      ? `<ul>${entries.map(entry => `<li>${e(entry)}</li>`).join("")}</ul>`
      : `<p>${e(entries)}</p>`}
  </div>`;
}

export function mountSettlementDetail(root) {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];

  let map;

  function select(index) {
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
    });
    if (panels[index].dataset.section === "Map") {
      map ??= mountSettlementMap(panels[index], photoIndex => {
        const galleryIndex = panels.findIndex(panel => panel.dataset.section === "Gallery");
        select(galleryIndex);
        const photo = root.querySelector(`#settlement-photo-${photoIndex}`);
        photo.focus();
        photo.scrollIntoView({ block: "center" });
      });
      map?.invalidateSize();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", event => {
      const next = {
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1
      }[event.key];
      if (!Number.isInteger(next)) return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
  select(tabs.findIndex(tab => tab.getAttribute("aria-selected") === "true"));
  return () => map?.remove();
}
