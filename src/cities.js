// Named Suvarnabhumi cities with independently sourced WGS84 reference points.
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function mountCityLayer(map,panel){
  let alive=true,cities=[],scope={},shown=true;
  const layer=L.layerGroup().addTo(map);
  const controls=document.createElement('div');controls.className='atlas-city-controls';
  controls.innerHTML='<label><input type="checkbox" checked data-city-toggle> Cities</label><span role="status" data-city-count>Loading cities…</span>';
  panel.querySelector('.atlas-tools').after(controls);
  const count=controls.querySelector('[data-city-count]');
  const markers=[];
  const visible=city=>(!scope.cakravala||city.cakravalaId===scope.cakravala)&&(!scope.country||city.country===scope.country);
  const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  function layoutLabels(){
    if(!alive||!shown)return;
    const size=map.getSize(),zoom=map.getZoom(),occupied=[];
    const panelBox=panel.getBoundingClientRect(),mapBox=map.getContainer().getBoundingClientRect();
    if(panelBox.width&&panelBox.height)occupied.push({left:panelBox.left-mapBox.left-8,right:panelBox.right-mapBox.left+8,top:panelBox.top-mapBox.top-8,bottom:panelBox.bottom-mapBox.top+8});
    for(const {city,marker} of markers){
      if(!layer.hasLayer(marker))continue;
      const point=map.latLngToContainerPoint(marker.getLatLng());
      const width=Math.min(245,city.name.length*7+20);
      const box={left:point.x+11,right:point.x+11+width,top:point.y-13,bottom:point.y+13};
      const labelVisible=(zoom>=5||city.type==='imperial_capital')&&box.left>=0&&box.right<=size.x&&box.top>=0&&box.bottom<=size.y&&!occupied.some(other=>intersects(box,other));
      if(labelVisible){marker.openTooltip();occupied.push(box)}else marker.closeTooltip();
    }
  }
  function render(){
    if(!alive)return;
    layer.clearLayers();
    const available=cities.filter(visible);
    if(shown)for(const entry of markers)if(visible(entry.city))entry.marker.addTo(layer);
    count.textContent=`${available.length} ${available.length===1?'city':'cities'}${scope.cakravala?' in this Cakravala':''}`;
    layoutLabels();
  }
  const toggle=()=>{shown=controls.querySelector('[data-city-toggle]').checked;render()};
  controls.querySelector('[data-city-toggle]').addEventListener('change',toggle);
  map.on('zoomend moveend resize',layoutLabels);
  fetch('./assets/map/cities/maharaja.json').then(response=>{if(!response.ok)throw Error(`HTTP ${response.status}`);return response.json()}).then(data=>{
    if(!alive)return;
    cities=data.cities;
    const ordered=[...cities].sort((a,b)=>Number(b.type==='imperial_capital')-Number(a.type==='imperial_capital')||a.name.localeCompare(b.name));
    for(const city of ordered){
      const imperial=city.type==='imperial_capital';
      const marker=L.marker([city.latitude,city.longitude],{title:city.name,alt:city.name,keyboard:true,bubblingMouseEvents:false,zIndexOffset:imperial?1000:0,icon:L.divIcon({className:`atlas-city-icon${imperial?' atlas-city-icon--capital':''}`,html:imperial?'<span aria-hidden="true">★</span>':'<span aria-hidden="true"></span>',iconSize:imperial?[20,20]:[12,12],iconAnchor:imperial?[10,10]:[6,6]})});
      marker.bindTooltip(escape(city.name),{permanent:true,direction:'right',offset:[9,0],className:'atlas-city-label',opacity:1});
      marker.bindPopup(`<article class="atlas-city-popup"><span class="atlas-city-popup__eyebrow">${imperial?'Imperial capital':'Major city'}</span><h3>${escape(city.name)}</h3><p>${escape(city.mandala)}<br>${escape(city.cakravala)}</p><p class="atlas-city-popup__reference">Location reference: ${escape(city.reference)}</p>${city.note?`<p class="atlas-city-popup__reference">Representative point: ${escape(city.anchor)}</p>`:''}</article>`,{className:'atlas-city-popup-shell',maxWidth:290});
      markers.push({city,marker});
    }
    render();
  }).catch(error=>{if(alive){count.textContent='Cities unavailable';count.title=error.message}});
  return {setScope(next={}){scope=next;render()},destroy(){alive=false;map.off('zoomend moveend resize',layoutLabels);layer.remove();controls.remove()}};
}
