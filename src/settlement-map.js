import { escapeHTML as e } from "./components.js";
import { maharajapuraLandmarkGallery as gallery } from "./maharajapura-gallery.js";

const palace = "Grand Palace of Suvarnabhumi";
const highlights = new Map([
  [palace, {
    label: "Grand Palace",
    location: "Maharajapura, Batam",
    description: "The imperial palace and ceremonial heart of Suvarnabhumi overlooks the waterfront at Teluk Tering. Its faceted gold dome crowns a white audience hall, flanked by terraced wings and reflecting pools.",
    direction: "right"
  }],
  ["Grand Observatory", {
    offset: [-8, 9],
    description: "Founded in 1362, the observatory on Bukit Senyum marks the beginnings of Maharajapura.",
    direction: "left"
  }],
  ["Imperial Grounds", {
    offset: [32, 44],
    description: "Three ceremonial terraces rise from the waterfront to the palace. Blue-tiled ministries flank the processional route.",
    direction: "bottom"
  }],
  ["Maharajapura Central Station", { label: "Central Station", direction: "bottom", offset: [-70, 30] }],
  ["Sengkuang Financial District", { direction: "top" }],
  ["Maharajapura Old Port", { label: "Old Port", direction: "left", offset: [-8, -26] }],
  ["National University of Suvarnabhumi (NUS)", { label: "NUS", direction: "right" }]
]);

const views = {
  capital: [[0.88, 103.68], [1.43, 104.43]],
  batam: [[1.047, 103.93], [1.228, 104.16]],
  temasek: [[1.22, 103.60], [1.47, 104.06]],
  bintan: [[0.88, 104.26], [1.22, 104.66]],
  islands: [[-0.58, 103.25], [4.03, 108.55]]
};

const places = [
  ["Temasek", [1.36, 103.82]],
  ["Batam", [1.09, 104.025]],
  ["Bintan", [1.055, 104.49]],
  ["Pulau Bulan", [0.98, 103.85]]
];

export function settlementMap() {
  return `<div class="settlement-map">
    <div class="settlement-map__canvas" aria-label="Map of Maharajapura and the Malaya Islands"></div>
    <div class="settlement-map__controls">
      <select aria-label="Map area">
        <option value="capital">Malaya Islands Capital Region</option>
        <option value="batam">Maharajapura &amp; Batam</option>
        <option value="temasek">Temasek</option>
        <option value="bintan">Bintan</option>
        <option value="islands">All Malaya Islands</option>
      </select>
      <div class="settlement-map__zoom">
        <button type="button" data-map="in" aria-label="Zoom in">+</button>
        <button type="button" data-map="out" aria-label="Zoom out">−</button>
        <button type="button" data-map="reset" aria-label="Reset map view">⌖</button>
      </div>
    </div>
    <p class="settlement-map__status" role="status">Loading the map…</p>
    <aside class="settlement-map__card" aria-label="Selected landmark" hidden>
      <button type="button" class="settlement-map__close" aria-label="Close landmark details">×</button>
      <div class="settlement-map__landmark" aria-live="polite"></div>
      <button type="button" class="settlement-map__gallery">View in Gallery</button>
    </aside>
  </div>`;
}

export function mountSettlementMap(panel, openGallery) {
  const shell = panel.querySelector(".settlement-map");
  const canvas = shell.querySelector(".settlement-map__canvas");
  const status = shell.querySelector(".settlement-map__status");
  const select = shell.querySelector("select");
  const card = shell.querySelector(".settlement-map__card");
  const landmark = card.querySelector(".settlement-map__landmark");
  const galleryButton = card.querySelector(".settlement-map__gallery");
  const L = window.L;
  if (!L) {
    status.textContent = "The map is temporarily unavailable.";
    shell.querySelector(".settlement-map__controls").hidden = true;
    return;
  }

  const abort = new AbortController();
  const map = L.map(canvas, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    minZoom: 5,
    maxZoom: 16,
    zoomSnap: 0.25
  });
  L.control.attribution({ prefix: false, position: "bottomleft" }).addAttribution(
    '<a href="./assets/map/global/README.md">Coastlines · UNICEF GeoRepo</a>'
  ).addTo(map);

  const regionalPins = L.layerGroup();
  const featuredPins = L.layerGroup().addTo(map);
  let activeMarker;
  let activePhoto;
  let defaultMarker;
  let layoutFrame;

  function fitView() {
    if (!canvas.clientWidth || !canvas.clientHeight) return;
    const sidebar = window.matchMedia("(min-width: 821px)").matches
      ? Math.min(canvas.clientWidth * 0.29, 484)
      : 0;
    map.fitBounds(views[select.value], {
      paddingTopLeft: [24, 24],
      paddingBottomRight: [24 + sidebar, 24],
      animate: false,
      maxZoom: 13
    });
  }

  function updatePins() {
    const showRegional = map.getZoom() >= 11.5 || select.value !== "capital";
    if (showRegional) regionalPins.addTo(map);
    else regionalPins.remove();
  }

  function openCard(feature, marker) {
    const { name, anchor } = feature.properties;
    const details = highlights.get(name);
    activePhoto = gallery.findIndex(photo => photo.caption === name);
    const photo = gallery[activePhoto];
    activeMarker?.getElement()?.classList.remove("is-selected");
    activeMarker = marker;
    marker.getElement()?.classList.add("is-selected");
    landmark.innerHTML = `${photo ? `<img src="${e(photo.src)}" alt="${e(photo.alt)}">` : ""}
      <h2>${e(name)}</h2>
      <p class="settlement-map__location"><span aria-hidden="true">⌖</span> ${e(details?.location ?? anchor)}</p>
      ${details?.description ? `<p class="settlement-map__description">${e(details.description)}</p>` : ""}`;
    galleryButton.hidden = !photo;
    card.hidden = false;
  }

  function closeCard() {
    card.hidden = true;
    const opener = activeMarker?.getElement();
    opener?.classList.remove("is-selected");
    (opener || select).focus({ preventScroll: true });
    activeMarker = undefined;
  }

  card.querySelector(".settlement-map__close").addEventListener("click", closeCard);
  card.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCard();
  });
  galleryButton.addEventListener("click", () => openGallery(activePhoto));
  select.addEventListener("change", () => {
    fitView();
    updatePins();
  });
  shell.querySelector('[data-map="in"]').addEventListener("click", () => map.zoomIn());
  shell.querySelector('[data-map="out"]').addEventListener("click", () => map.zoomOut());
  shell.querySelector('[data-map="reset"]').addEventListener("click", () => {
    select.value = "capital";
    if (defaultMarker) openCard(...defaultMarker);
    fitView();
    updatePins();
  });
  map.on("zoomend", updatePins);

  async function loadMap() {
    const fetchData = async file => {
      const response = await fetch(`./assets/map/cities/${file}.geojson`, { signal: abort.signal });
      if (!response.ok) throw new Error(`Unable to load ${file}`);
      return response.json();
    };
    try {
      const [coast, pins] = await Promise.all([
        fetchData("malaya-islands-coast"), fetchData("malaya-islands-landmarks")
      ]);
      if (abort.signal.aborted) return;

      L.geoJSON(coast, {
        interactive: false,
        style: { stroke: false, fillColor: "#f4dfb3", fillOpacity: 1 }
      }).addTo(map);

      places.forEach(([name, coordinates]) => {
        L.marker(coordinates, {
          icon: L.divIcon({ className: "settlement-map__place", html: name, iconSize: [0, 0] }),
          interactive: false,
          keyboard: false,
          zIndexOffset: -10000
        }).addTo(map);
      });

      for (const feature of pins.features) {
        const { name } = feature.properties;
        const [longitude, latitude] = feature.geometry.coordinates;
        const details = highlights.get(name);
        const isPalace = name === palace;
        const size = isPalace ? 30 : details ? 14 : 12;
        const marker = L.marker([latitude, longitude], {
          title: name,
          alt: name,
          zIndexOffset: isPalace ? 2000 : details ? 1000 : 0,
          icon: L.divIcon({
            className: `settlement-map__pin${isPalace ? " settlement-map__pin--palace" : ""}`,
            html: isPalace ? '<span aria-hidden="true">★</span>' : "",
            iconSize: [size, size]
          })
        });
        marker.on("add", () => {
          const element = marker.getElement();
          element.setAttribute("aria-label", name);
          element.classList.toggle("is-selected", marker === activeMarker);
          element.addEventListener("keydown", event => {
            if (event.key === " ") {
              event.preventDefault();
              openCard(feature, marker);
            }
          });
        });
        marker.bindTooltip(e(details?.label ?? name), {
          permanent: Boolean(details),
          direction: details?.direction ?? "top",
          offset: details?.offset ?? [0, 0],
          className: "settlement-map__label"
        });
        marker.on("click", () => openCard(feature, marker));
        marker.addTo(details ? featuredPins : regionalPins);
        if (isPalace) defaultMarker = [feature, marker];
      }

      if (defaultMarker) openCard(...defaultMarker);
      updatePins();
      status.hidden = true;
    } catch (error) {
      if (error.name !== "AbortError") status.textContent = "Map data could not be loaded. Please reload the page.";
    }
  }

  fitView();
  loadMap();

  return {
    invalidateSize() {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() => {
        map.invalidateSize();
      });
    },
    remove() {
      abort.abort();
      cancelAnimationFrame(layoutFrame);
      map.remove();
    }
  };
}
