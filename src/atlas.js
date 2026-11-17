// Data-driven drill-down for the imperial atlas. Feature geometry is loaded separately.
const DATA_URLS=["MMR","IDN","CHN","MYS","KHM","LAO","VNM","BGD"].map(iso=>"./assets/map/"+iso+".geojson");
const names={Srivijaya_Suvarnabhumi_Capital_Region:"Srivijaya Special Administrative Region",Malaya_Islands:"Malaya Islands Capital Region"};
const display=key=>names[key]||String(key||"").replaceAll("_"," ");
const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const getGroup=feature=>feature.properties?.cakravala||feature.properties?.group||null;
const style=(selected=false)=>({color:selected?"#f3d49b":"#d5ac6c",weight:selected?2:1,fillColor:selected?"#ba7c3f":"#c9a26b",fillOpacity:selected?.49:.22});
export function mountMaharajaAtlas(map){
  let alive=true,layer=null,selected=null;
  const root=document.createElement("section");
  root.className="atlas-panel";
  root.setAttribute("aria-label","Imperial atlas explorer");
  root.innerHTML='<span class="atlas-panel__eyebrow">IMPERIAL ATLAS / MAHARAJA MANDALA</span><h2>Explore the Mandala</h2><p class="atlas-panel__status" role="status">Loading regional boundaries…</p><div class="atlas-panel__breadcrumb"></div><div class="atlas-panel__list"></div>';
  document.querySelector("#home")?.append(root);
  const status=root.querySelector(".atlas-panel__status"),crumb=root.querySelector(".atlas-panel__breadcrumb"),list=root.querySelector(".atlas-panel__list");
  const focus=target=>{if(target?.isValid?.())map.flyToBounds(target,{padding:[45,45],maxZoom:8,duration:1.1})};
  function showMandala(){
    selected=null;
    layer.eachLayer(l=>l.setStyle(style()));
    crumb.innerHTML='<span>Maharaja Mandala</span>';
    const groups=new Map();
    layer.eachLayer(l=>{const key=getGroup(l.feature);if(key){if(!groups.has(key))groups.set(key,[]);groups.get(key).push(l)}});
    status.textContent=groups.size+" Cakravalas mapped so far · eight-country coverage";
    list.innerHTML=[...groups.keys()].sort((a,b)=>display(a).localeCompare(display(b))).map(key=>'<button type="button" data-group="'+esc(key)+'"><span>'+esc(display(key))+'</span><span aria-hidden="true">→</span></button>').join("");
    if(document.querySelector("#home")?.classList.contains("is-exploring"))focus(layer.getBounds());
  }
  function showGroup(key){
    selected=key;
    const found=[];
    layer.eachLayer(l=>{const on=getGroup(l.feature)===key;l.setStyle(style(on));if(on){l.bringToFront();found.push(l)}});
    if(!found.length)return;
    const bounds=L.featureGroup(found).getBounds();
    crumb.innerHTML='<button type="button" data-back="mandala">Maharaja Mandala</button><span aria-hidden="true"> / </span><span>'+esc(display(key))+'</span>';
    status.textContent=found.length+" mapped administrative areas";
    list.innerHTML=found.map(l=>{const p=l.feature.properties||{};const label=p.label||[p.NAME_1,p.NAME_2,p.NAME_3].filter(Boolean).join(" · ")||p.name||"Area";return '<button type="button" data-area="'+esc(String(L.stamp(l)))+'"><span>'+esc(label)+'</span><span aria-hidden="true">↗</span></button>'}).join("");
    focus(bounds);
  }
  const byId=new Map();
  root.addEventListener("click",event=>{
    const back=event.target.closest("[data-back]");if(back){showMandala();return}
    const group=event.target.closest("[data-group]");if(group){showGroup(group.dataset.group);return}
    const area=event.target.closest("[data-area]");if(area){const l=byId.get(Number(area.dataset.area));if(l){focus(l.getBounds());l.openPopup()}}
  });
  Promise.all(DATA_URLS.map(url=>fetch(url).then(r=>{if(!r.ok)throw Error("Geometry not published: "+url);return r.json()}))).then(collections=>{\n    const data={type:"FeatureCollection",features:collections.flatMap(item=>item.features||[])};
    if(!alive)return;
    if(data.type!=="FeatureCollection"||!Array.isArray(data.features))throw Error("Invalid map data");
    layer=L.geoJSON(data,{style:()=>style(),onEachFeature:(feature,l)=>{
      byId.set(L.stamp(l),l);
      const p=feature.properties||{};
      const label=p.label||[p.NAME_1,p.NAME_2,p.NAME_3].filter(Boolean).join(" · ")||p.name||"Area";
      l.bindPopup('<strong>'+esc(label)+'</strong><br>'+esc(display(getGroup(feature)||"Maharaja Mandala")));
      l.on("click",()=>{if(!document.querySelector("#home")?.classList.contains("is-exploring"))document.querySelector("#explore-map")?.click();showGroup(getGroup(feature));l.openPopup()});
    }}).addTo(map);
    showMandala();
  }).catch(()=>{if(alive){status.textContent="Regional boundaries could not be loaded. Please retry later.";list.innerHTML="";crumb.innerHTML=""}});
  return()=>{alive=false;root.remove();if(layer)map.removeLayer(layer)};
}
