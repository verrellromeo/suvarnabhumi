// Global UNICEF atlas and the SVG-derived Maharaja Mandala hierarchy.
const BASE = "./assets/map/global/";
const MANDALA_BASE = "./assets/map/maharaja/";
const packCache = new Map();
const goldStyle = {color:"#755b28", weight:.8, fillColor:"#e3bc55", fillOpacity:.48};
const selectedGoldStyle = {color:"#fff0bb", weight:2, fillColor:"#edc54e", fillOpacity:.78};
const cakravalaNames = {
  Srivijaya_Suvarnabhumi_Capital_Region:"Srivijaya Special Administrative Region",
  Malaya_Islands:"Malaya Islands Capital Region",
};
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function readCompressed(url){const response=await fetch(url);if(!response.ok)throw Error(`HTTP ${response.status}`);const stream=response.body.pipeThrough(new DecompressionStream("gzip"));return JSON.parse(await new Response(stream).text())}
async function countryData(id,manifest){const pack=manifest.countries[id].pack;if(!packCache.has(pack))packCache.set(pack,readCompressed(`${BASE}packs/${pack}`).catch(error=>{packCache.delete(pack);throw error}));return (await packCache.get(pack))[id]}
const globalStyle=(selected=false,assigned=false)=>({color:selected?"#fff1c4":assigned?"#e2ba74":"#b2c0bf",weight:selected?2:.8,fillColor:selected?"#e5a84f":assigned?"#b97837":"#91aeb2",fillOpacity:selected?.65:assigned?.43:.2});
const cakravalaLabel=id=>cakravalaNames[id]||id.replaceAll("_"," ");

export function mountMaharajaAtlas(map){
  let alive=true,world=null,detail=null,selected=null,manifest=null,mandalaIndex=null,boundaryData=null,boundaryPromise=null,mandalaIndexPromise=null,currentAreaFeatures=[];
  const areaPackCache=new Map();
  let mode="mandalas",currentCountry=null,currentCakravala=null;
  const saved=JSON.parse(localStorage.getItem("suvarnabhumi-adm2-assignments")||"{}");
  const root=document.createElement("section");root.className="atlas-panel";root.setAttribute("aria-label","Mandala and ADM2 atlas");
  root.innerHTML='<span class="atlas-panel__eyebrow">SUVARṆABHŪMI / IMPERIAL ATLAS</span><h2>Maharaja Mandala</h2><p class="atlas-panel__status" role="status">Loading atlas…</p><div class="atlas-panel__breadcrumb"></div><div class="atlas-mode-actions"><button type="button" data-world>Browse global ADM2</button><button type="button" data-export-mandala>Export Maharaja data</button><button type="button" data-export>Export selections</button></div><div class="atlas-tools"><input type="search" placeholder="Search Mandala, Cakravala or ADM2" aria-label="Search atlas"/></div><div class="atlas-panel__list"></div><div class="atlas-editor" hidden><strong class="atlas-editor__name"></strong><p class="atlas-editor__membership" data-membership hidden></p><label>Mandala <input data-mandala placeholder="e.g. Maharaja Mandala"></label><label>Cakravala <input data-cakravala placeholder="e.g. Malaya Islands"></label><button type="button" data-save>Save area</button><button type="button" data-clear>Clear assignment</button></div><p class="atlas-credit">Maharaja Mandala membership follows the attached SVG Cakravala frames. Regional geometry sources and processing are documented in the map source notes. Global reference boundaries: UNICEF GeoRepo (CC BY 4.0), September 2026.</p>';
  document.querySelector("#home")?.append(root);
  const status=root.querySelector(".atlas-panel__status"),crumb=root.querySelector(".atlas-panel__breadcrumb"),list=root.querySelector(".atlas-panel__list"),search=root.querySelector('input[type="search"]'),editor=root.querySelector(".atlas-editor"),worldButton=root.querySelector("[data-world]"),heading=root.querySelector("h2");
  const labelOf=p=>p.label||p.name||p.id;
  const fit=layer=>{if(layer?.getBounds()?.isValid())map.fitBounds(layer.getBounds(),{padding:[35,35],maxZoom:8})};
  const countryName=id=>manifest?.countries[id]?.name||id;
  async function getMandalaIndex(){if(!mandalaIndexPromise)mandalaIndexPromise=fetch(`${MANDALA_BASE}manifest.json`).then(response=>{if(!response.ok)throw Error(`HTTP ${response.status}`);return response.json()}).then(data=>(mandalaIndex=data)).catch(error=>{mandalaIndexPromise=null;throw error});return mandalaIndexPromise}
  async function getBoundaries(){const index=await getMandalaIndex();if(!boundaryPromise)boundaryPromise=Promise.all(index.boundaryPacks.map(name=>readCompressed(`${MANDALA_BASE}${name}`))).then(parts=>(boundaryData={type:"FeatureCollection",features:parts.flatMap(part=>part.features)})).catch(error=>{boundaryPromise=null;throw error});return boundaryPromise}
  async function getCakravalaFeatures(name){if(!areaPackCache.has(name)){const record=mandalaIndex?.cakravalas?.[name];if(!record)throw Error(`Cakravala not found: ${name}`);areaPackCache.set(name,readCompressed(`${MANDALA_BASE}${record.pack}`).catch(error=>{areaPackCache.delete(name);throw error}))}return (await areaPackCache.get(name)).features}
  const clearDetail=()=>{if(detail){map.removeLayer(detail);detail=null}selected=null;editor.hidden=true};
  const resetWorldStyle=()=>world?.setStyle({opacity:1,fillOpacity:.28});
  const dimWorld=()=>world?.setStyle({opacity:.24,fillOpacity:.035});
  function setModeActions(){worldButton.textContent=mode==="countries"||mode==="countryAreas"?"Maharaja Mandala":"Browse global ADM2"}
  function setBreadcrumb(){
    if(mode==="mandalas"){crumb.textContent="World / Mandala";heading.textContent="Choose a Mandala"}
    else if(mode==="cakravalas"){crumb.innerHTML='<button type="button" data-mandalas>Mandala</button> / Maharaja Mandala';heading.textContent="Maharaja Mandala"}
    else if(mode==="mandalaAreas"){crumb.innerHTML='<button type="button" data-mandalas>Mandala</button> / <button type="button" data-back-cakravalas>Maharaja Mandala</button> / '+escape(cakravalaLabel(currentCakravala));heading.textContent=cakravalaLabel(currentCakravala)}
    else if(mode==="countries"){crumb.textContent="World ADM2";heading.textContent="Global ADM2"}
    else if(mode==="countryAreas"){crumb.innerHTML='<button type="button" data-countries>World ADM2</button> / '+escape(countryName(currentCountry));heading.textContent=countryName(currentCountry)}
    setModeActions();
  }
  function renderMandalas(){
    const q=search.value.trim().toLocaleLowerCase();
    const matches="maharaja mandala".includes(q);
    status.textContent=manifest?`${Object.keys(manifest.countries).length} global entities · ${manifest.total.toLocaleString()} ADM2 reference areas · 1 Mandala ready`:"Loading global index…";
    list.innerHTML=matches?'<button type="button" data-mandala="Maharaja Mandala"><span>Maharaja Mandala</span><small>29 Cakravalas</small></button>':"No matching Mandala";
  }
  function renderCakravalas(){
    if(!mandalaIndex)return;
    const entries=Object.entries(mandalaIndex.cakravalas);
    const q=search.value.trim().toLocaleLowerCase();
    const shown=entries.filter(([name])=>cakravalaLabel(name).toLocaleLowerCase().includes(q)).sort((a,b)=>cakravalaLabel(a[0]).localeCompare(cakravalaLabel(b[0])));
    status.textContent=`${entries.length} Cakravalas · ${mandalaIndex.total.toLocaleString()} mapped administrative areas`;
    list.innerHTML=shown.map(([name,record])=>`<button type="button" data-cakravala="${escape(name)}"><span>${escape(cakravalaLabel(name))}</span><small>${record.count.toLocaleString()} areas</small></button>`).join("")||"No matching Cakravala";
  }
  function visibleAreaFeatures(){return currentAreaFeatures}
  function renderMandalaAreas(){
    const q=search.value.trim().toLocaleLowerCase();
    const features=visibleAreaFeatures().filter(f=>labelOf(f.properties).toLocaleLowerCase().includes(q));
    status.textContent=`${(mandalaIndex?.cakravalas?.[currentCakravala]?.count||visibleAreaFeatures().length).toLocaleString()} areas in ${cakravalaLabel(currentCakravala)} · ${features.length.toLocaleString()} shown`;
    list.innerHTML=features.map(f=>`<button type="button" data-area="${escape(f.properties.id)}"><span>${escape(labelOf(f.properties))}</span><small>${escape(f.properties.adminLevel||"ADM2")} · ${escape(f.properties.country||"")}</small></button>`).join("")||"No matching administrative areas";
  }
  function renderCountries(){
    const q=search.value.toLocaleLowerCase();
    const ids=Object.keys(manifest?.countries||{}).filter(id=>(countryName(id)+" "+id).toLocaleLowerCase().includes(q)).sort((a,b)=>countryName(a).localeCompare(countryName(b)));
    status.textContent=`${Object.keys(manifest?.countries||{}).length} entities · ${manifest?.total?.toLocaleString()||0} ADM2 reference areas`;
    list.innerHTML=ids.map(id=>`<button type="button" data-country="${escape(id)}"><span>${escape(countryName(id))}</span><small>${manifest.countries[id].count.toLocaleString()}</small></button>`).join("")||"No matching country";
  }
  function renderCountryAreas(){
    const q=search.value.toLocaleLowerCase(),layers=[];
    detail?.eachLayer(layer=>{if(labelOf(layer.feature.properties).toLocaleLowerCase().includes(q))layers.push(layer)});
    status.textContent=`${manifest.countries[currentCountry].count.toLocaleString()} ADM2 areas in ${countryName(currentCountry)} · ${layers.length.toLocaleString()} shown`;
    list.innerHTML=layers.map(layer=>`<button type="button" data-area="${escape(layer.feature.properties.id)}"><span>${escape(labelOf(layer.feature.properties))}</span><small>${saved[layer.feature.properties.id]?"●":"↗"}</small></button>`).join("")||"No matching ADM2 areas";
  }
  function showMandalas(){mode="mandalas";currentCountry=null;currentCakravala=null;clearDetail();resetWorldStyle();search.value="";setBreadcrumb();renderMandalas()}
  function showCountries(){mode="countries";currentCountry=null;currentCakravala=null;clearDetail();resetWorldStyle();search.value="";setBreadcrumb();renderCountries()}
  async function openMandala(){
    mode="cakravalas";currentCountry=null;currentCakravala=null;clearDetail();search.value="";setBreadcrumb();status.textContent="Loading Maharaja Mandala boundaries…";list.innerHTML="";
    try{
      await Promise.all([getMandalaIndex(),getBoundaries()]);
      if(!alive||mode!=="cakravalas")return;
      detail=L.geoJSON(boundaryData,{style:()=>goldStyle,onEachFeature:(feature,layer)=>{layer.on("click",()=>openCakravala(feature.properties.cakravala));layer.bindTooltip(cakravalaLabel(feature.properties.cakravala),{sticky:true})}}).addTo(map);
      dimWorld();fit(detail);renderCakravalas();
    }catch(error){status.textContent=`Could not load Maharaja Mandala: ${error.message}`;list.innerHTML='<button type="button" data-retry-mandala>Retry</button>'}
  }
  async function openCakravala(name){
    if(!mandalaIndex)return;mode="mandalaAreas";currentCakravala=name;currentAreaFeatures=[];clearDetail();search.value="";setBreadcrumb();status.textContent=`Loading ${cakravalaLabel(name)} ADM2 boundaries…`;list.innerHTML="";
    try{
      const features=await getCakravalaFeatures(name);
      if(!alive||mode!=="mandalaAreas"||currentCakravala!==name)return;
      currentAreaFeatures=features;
      detail=L.geoJSON({type:"FeatureCollection",features},{style:()=>goldStyle,onEachFeature:(feature,layer)=>{layer.on("click",()=>selectArea(layer));layer.bindTooltip(labelOf(feature.properties),{sticky:true})}}).addTo(map);
      dimWorld();fit(detail);renderMandalaAreas();
    }catch(error){status.textContent=`Could not load ${cakravalaLabel(name)}: ${error.message}`;list.innerHTML='<button type="button" data-back-cakravalas>Back to Cakravalas</button>'}
  }
  async function openCountry(id){
    mode="countryAreas";currentCountry=id;currentCakravala=null;clearDetail();search.value="";setBreadcrumb();status.textContent="Loading ADM2 boundaries…";list.innerHTML="";
    try{const data=await countryData(id,manifest);if(!data)throw Error("No geometry in snapshot");if(!alive||mode!=="countryAreas"||currentCountry!==id)return;
      detail=L.geoJSON(data,{style:feature=>globalStyle(false,!!saved[feature.properties.id]),onEachFeature:(feature,layer)=>{layer.on("click",()=>selectArea(layer));layer.bindTooltip(labelOf(feature.properties),{sticky:true})}}).addTo(map);fit(detail);dimWorld();renderCountryAreas();
    }catch(error){status.textContent=`Could not load ${countryName(id)}: ${error.message}`;list.innerHTML='<button type="button" data-retry-country>Retry</button>'}
  }
  function selectArea(layer){
    if(selected)selected.setStyle(mode==="mandalaAreas"||mode==="cakravalas"?goldStyle:globalStyle(false,!!saved[selected.feature.properties.id]));
    selected=layer;layer.setStyle(selectedGoldStyle);layer.bringToFront();
    const p=layer.feature.properties,a=saved[p.id]||{};
    editor.hidden=false;editor.querySelector(".atlas-editor__name").textContent=labelOf(p);
    const readonly=mode==="mandalaAreas"||mode==="cakravalas";
    editor.querySelector("[data-membership]").hidden=!readonly;
    editor.querySelector("[data-membership]").textContent=readonly?`${p.adminLevel||"ADM2"} · ${p.mandala||"Maharaja Mandala"} / ${cakravalaLabel(p.cakravala)}`:"";
    editor.querySelectorAll("label,[data-save],[data-clear]").forEach(control=>{control.hidden=readonly});
    editor.querySelector("[data-mandala]").value=a.mandala||p.mandala||"";
    editor.querySelector("[data-cakravala]").value=a.cakravala||p.cakravala||"";
    layer.openTooltip();
  }

  root.addEventListener("click",async event=>{
    const el=event.target.closest("button");if(!el)return;
    if(el.hasAttribute("data-world")){mode==="countries"||mode==="countryAreas"?showMandalas():showCountries();return}
    if(el.hasAttribute("data-mandalas")){showMandalas();return}
    if(el.hasAttribute("data-countries")){showCountries();return}
    if(el.hasAttribute("data-back-cakravalas")){openMandala();return}
    if(el.dataset.mandala){openMandala();return}
    if(el.dataset.cakravala){openCakravala(el.dataset.cakravala);return}
    if(el.dataset.country){openCountry(el.dataset.country);return}
    if(el.hasAttribute("data-retry-mandala")){openMandala();return}
    if(el.hasAttribute("data-retry-country")){openCountry(currentCountry);return}
    if(el.dataset.area){
      const layerFound=[];detail?.eachLayer(layer=>{if(layer.feature.properties.id===el.dataset.area)layerFound.push(layer)});
      if(layerFound[0]){selectArea(layerFound[0]);fit(layerFound[0])}return;
    }
    if(el.hasAttribute("data-save")&&selected){
      const p=selected.feature.properties,mandala=editor.querySelector("[data-mandala]").value.trim(),cakravala=editor.querySelector("[data-cakravala]").value.trim();
      if(!mandala||!cakravala){status.textContent="Fill in both Mandala and Cakravala.";return}
      saved[p.id]={name:labelOf(p),country:currentCountry||p.country,mandala,cakravala};localStorage.setItem("suvarnabhumi-adm2-assignments",JSON.stringify(saved));
      selected.setStyle(selectedGoldStyle);if(mode==="mandalaAreas")renderMandalaAreas();else if(mode==="cakravalas")renderCakravalas();else if(mode==="countryAreas")renderCountryAreas();return;
    }
    if(el.hasAttribute("data-clear")&&selected){delete saved[selected.feature.properties.id];localStorage.setItem("suvarnabhumi-adm2-assignments",JSON.stringify(saved));selected.setStyle(mode==="mandalaAreas"||mode==="cakravalas"?goldStyle:globalStyle());if(mode==="mandalaAreas")renderMandalaAreas();else if(mode==="countryAreas")renderCountryAreas();return}
    if(el.hasAttribute("data-export")){
      const mandalas={};for(const [id,area] of Object.entries(saved)){const group=mandalas[area.mandala]??={};(group[area.cakravala]??=[]).push({id,name:area.name,country:area.country})}
      const blob=new Blob([JSON.stringify({schema:"suvarnabhumi-adm2-v1",source:"UNICEF GeoRepo 2026-09-16; regional map source notes in assets/map/SOURCES.md",mandalas,assignments:saved},null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="suvarnabhumi-adm2-selections.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    if(el.hasAttribute("data-export-mandala")){
      try{
        await Promise.all([getMandalaIndex(),getBoundaries()]);
        const entries=Object.keys(mandalaIndex.cakravalas);
        const groups=await Promise.all(entries.map(async name=>({name,features:await getCakravalaFeatures(name)})));
        const features=groups.flatMap(group=>group.features);
        const blob=new Blob([JSON.stringify({schema:"suvarnabhumi-mandala-map-v1",source:"SVG Cakravala frames and open regional geometry; see assets/map/SOURCES.md",mandalas:{"Maharaja Mandala":{cakravalaBoundaries:boundaryData.features,adm2Areas:features}},},null,2)],{type:"application/json"});
        const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="maharaja-mandala-cakravalas.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      }catch(error){status.textContent=`Could not export Maharaja Mandala: ${error.message}`}
    }
  });
  search.addEventListener("input",()=>{if(mode==="mandalas")renderMandalas();else if(mode==="cakravalas")renderCakravalas();else if(mode==="mandalaAreas")renderMandalaAreas();else if(mode==="countries")renderCountries();else renderCountryAreas()});
  fetch(`${BASE}manifest.json`).then(response=>{if(!response.ok)throw Error("Manifest unavailable");return response.json()}).then(async data=>{
    manifest=data;renderMandalas();
    const parts=await Promise.all(data.worldPacks.map(name=>readCompressed(`${BASE}${name}`)));
    if(!alive)return;
    world=L.geoJSON({type:"FeatureCollection",features:parts.flatMap(part=>part.features)},{style:{color:"#c9a26b",weight:1,fillColor:"#62818c",fillOpacity:.28},onEachFeature:(feature,layer)=>{layer.on("click",()=>{if(manifest.countries[feature.properties.country])openCountry(feature.properties.country)});layer.bindTooltip(feature.properties.name||feature.properties.country,{sticky:true})}}).addTo(map);
  }).catch(error=>{status.textContent=`Global atlas unavailable: ${error.message}`});
  return()=>{alive=false;root.remove();if(detail)map.removeLayer(detail);if(world)map.removeLayer(world)};
}
