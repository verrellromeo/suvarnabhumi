import { maharajapuraLandmarkGallery } from "./maharajapura-gallery.js";

// Editorial starter content. Dates are included only where the project canon confirms them.
export const settlements = [
  {id:"srivijaya",name:"Srivijaya",region:"Srivijaya Special Administrative Region",type:"Sacred metropolis",era:"Founded 683",image:"https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&q=85",summary:"The sacred Musi River metropolis and a living archive of the empire's maritime beginnings.",detail:"From a riverine Buddhist kingdom to an enduring centre of dynastic memory, scholarship and pilgrimage.",features:["Musi River","Imperial archives","Maritime heritage"]},
  {
    id: "maharajapura",
    name: "Maharajapura",
    region: "Malaya Islands Capital Region",
    type: "Imperial capital",
    era: "Capital since 1749",
    image: "./assets/settlements/maharajapura-panorama.webp",
    hero: {
      src: maharajapuraLandmarkGallery.find(photo => photo.caption === "Grand Palace of Suvarnabhumi").src,
      alt: "The gold-domed Grand Palace of Suvarnabhumi at the waterfront"
    },
    subtitle: "Imperial seat of the Malaya Islands",
    overviewTitle: "A capital across the strait",
    summary: "Maharajapura is the imperial capital of the Malaya Islands Capital Region. Bridges and maritime corridors link its ceremonial districts, working harbours and financial centres across the Selat Maharaja.",
    detail: "White-and-gold palaces and blue-tiled ministries face the strait. Shaded colonnades, civic plazas and mangrove promenades connect the waterfront to the city’s modern skyline.",
    facts: [
      {label: "Metro population estimate", value: "75.0 million"},
      {label: "Capital since", value: "1749"}
    ],
    history: "Maharajapura succeeded Srivijaya as the imperial capital in 1749, after the end of the concession order. The move marked a period of imperial renewal.",
    districts: ["Royal and administrative core", "Naval harbours", "Finance islands", "University districts", "Garden townships"],
    features: ["Imperial palace", "Ceremonial causeways", "Mangrove promenades"],
    feature: {
      title: "The ceremonial waterfront",
      src: "./assets/settlements/maharajapura-waterfront.webp",
      alt: "Illustration of a shaded waterfront colonnade overlooking the imperial palace"
    },
    gallery: maharajapuraLandmarkGallery
  },
  {id:"benghali",name:"Benghali",region:"Bengal Oriental",type:"Delta metropolis",era:"River and textile city",image:"https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=85",summary:"A city of levee gardens, canal boulevards, textile exchanges and river logistics.",detail:"Benghali's urban form follows the lower Bengal delta and its interwoven networks of waterways and textile trade.",features:["Levee gardens","Textile exchanges","Canals"]},
  {id:"zanzibar",name:"Zanzibar",region:"Ratnadvipa",type:"Oceanic port",era:"Conquered 1750",image:"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=85",summary:"The pearl port and customs throne of the East African Swahili coast.",detail:"Coral-stone quarters, dhow quays and Pemba spice terraces shape this tropical oceanic metropolis.",features:["Stone Quarter","Pemba spice terraces","Dhow quays"]},
  {id:"edo-kanto",name:"Edo–Kantō",region:"Utyanagara",type:"Northern command city",era:"Founded 1457",image:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=85",summary:"A metropolis of canal heritage, rail precision and Pacific finance.",detail:"Its founding in 1457 followed the shogunate's allegiance to Suvarnabhumi in 1325; those are distinct events.",features:["Canal heritage","Rail networks","Pacific finance"]},
  {id:"batavia",name:"Batavia",region:"Sundapura coast",type:"Canal metropolis",era:"Founded 1605 · returned 1749",image:"https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=1600&q=85",summary:"A former Dutch trading enclave transformed into a grand canal metropolis.",detail:"Founded in 1605 as a controlled trading enclave, Batavia returned to Suvarnabhumi in 1749.",features:["Canal districts","Creole heritage","Maritime trade"]}
];
export const history = [
  {date:"683",title:"The founding of Srivijaya",body:"The Musi River becomes the sacred origin of an enduring maritime polity.",place:"Srivijaya"},
  {date:"1325",title:"Allegiance of the shogunate",body:"The Japanese shogunate pledges allegiance to Suvarnabhumi. Edo–Kantō is founded later.",place:"Utyanagara"},
  {date:"c. 1380",title:"Dynastic union with Sukhothai",body:"Navasuvara's protection and subsequent dynastic union bring Sukhothai into the imperial sphere.",place:"Sukhothai"},
  {date:"1470–1478",title:"The conquest of Nilabhumi",body:"A sustained conquest period establishes Suvarnabhumi's rule in Nilabhumi.",place:"Nilabhumi"},
  {date:"1749",title:"The return of the enclaves",body:"European trading enclaves return to Suvarnabhumi's sovereignty.",place:"Western heritage districts"},
  {date:"1750",title:"The conquest of Zanzibar",body:"Zanzibar enters the imperial realm along the East African coast.",place:"Ratnadvipa"}
];
// Expandable chronology template. Short event previews precede full canon articles.
export const historyEras = [
  {id:'pre-suvarnabhumi',date:'1017–1072',title:'Pre-Suvarnabhumi',summary:'From the royal massacre of 1017 to the dynastic alliances that prepared the Union of Suvarnabhumi.',events:[
    {date:'1017',title:'Chola Invasion',place:'Srivijaya / Palembang',body:'The Royal Massacre of 1017 destroys the old court without establishing permanent Chola rule. Suryaputradewa survives in exile, leaving a path toward dynastic restoration.'},
    {date:'1018',title:'Registry of Orphaned Houses',place:'Surviving port communities',body:'Local scribes, merchant elders and religious custodians record displaced dependants and disputed household claims. The emerging coalition supports protection through its commercial contacts.'},
    {date:'1017–1025',title:'Rise of Suryaputradewa',place:'The Srivijayan maritime network',body:'The exiled royal relative builds a coalition of merchants, surviving admirals and port communities. Ships, credit and local alliances make his return possible.'},
    {date:'1021',title:'Restoration of River Markets',place:'Cooperating river ports',body:'Selected markets reopen through local agreements on tolls, escorted supplies and repaired landings. Commercial recovery strengthens the coalition before full restoration.'},
    {date:'1025',title:'Sumpah Nagara',place:'Srivijaya',body:'The oath binds the restored order to collective protection and maritime unity. The memory of 1017 becomes a political argument against fragmented ports and rival loyalties.'},
    {date:'1025–1027',title:'Unification of Sumatera',place:'Sumatera',body:'Diplomacy, naval pressure and negotiated submission bind major ports and river corridors to the center. Local rulers retain roles while losing independent strategic authority.'},
    {date:'1026',title:'The First Harbor Law',place:'Ports under Nagara authority',body:'An early ordinance clarifies declared cargo, recognized tolls, anchorage and port disputes. Enforcement develops unevenly as ports accept Nagara rule.'},
    {date:'1027',title:'The Widows and Sailors Relief Fund',place:'The maritime core',body:'A limited reserve of grain, cloth and coin supports injured crews and verified dependants of sailors lost in service. Assistance depends on available supplies and local testimony.'},
    {date:'1029–1032',title:'Occupation of Malay Peninsula',place:'The Malay Peninsula',body:'Kadaram and other strategic ports enter an occupation and protection network. Controlling both shores turns the straits into a guarded system of ports, registries and garrisons.'},
    {date:'1032',title:'Royal Marriage with Song',place:'The Song–Srivijaya courts',body:'Suryaputradewa marries a direct daughter of the Song emperor. The pact strengthens dynastic recognition, regulated trade and the connection between the two courts.'},
    {date:'1033',title:'The House of Mixed Blood Debate',place:'The Srivijayan court',body:'Court factions contest the standing of mixed merchant households after the Song marriage. The ruler protects recognized loyalty and service without abolishing aristocratic rank.'},
    {date:'1037',title:'Conquest of Sunda',place:'Western Java',body:'The Western Java Gate Campaign extends Nagara control toward Sunda and the strategic approaches between Sumatera and Java.'},
    {date:'1041',title:'Conquest of Tambralingga',place:'The northern peninsula',body:'The campaign resolves the northern peninsula threat left unfinished by earlier occupation. It extends the security system beyond the first straits settlements.'},
    {date:'1045',title:'First School of Explorer and Navigators',place:'The Srivijayan maritime core',body:'A small royal-supported apprenticeship brings experienced navigators together with selected crews. Coastal surveying, seasonal winds, sounding lines and route notes prepare the ground for later navigation academies.'},
    {date:'1051',title:'Thai People Protectorate',place:'The mainland frontier',body:'Thai communities seek protection from pressure by neighboring powers. Srivijayan patronage creates a new mainland frontier relationship.'},
    {date:'1059',title:'Khmer Invasion of Thai Protectorate',place:'The Thai–Khmer frontier',body:'Khmer attacks trigger a joint Srivijayan and Thai response. The counter-offensive occupies frontier territories and accelerates Thai political consolidation.'},
    {date:'1060',title:'Settlement among Borneo River Kingdoms',place:'Borneo river networks',body:'Settlement and negotiated relationships establish an eastern foothold among river authorities. Practical access depends on local communities and navigable routes.'},
    {date:'1061',title:'Conquest of Borneo',place:'Borneo',body:'The Borneo Mandala War brings key river and coastal authorities into the Nagara order. Political claims do not imply uniform direct control over the island interior.'},
    {date:'1062',title:'The Borneo Timber Standard',place:'Registered timber ports',body:'Procurement agreements distinguish suitable shipbuilding timber, accepted loads and paid purchases from tribute. River intermediaries remain essential to supply and enforcement.'},
    {date:'1065',title:'Council of Frontier Governors',place:'The Srivijayan court',body:'Dependent rulers, commanders and port representatives clarify negotiated tribute, service and reporting obligations. Consultation helps make the expanding order less dependent on personal commands.'},
    {date:'1070',title:'Rise of Aryanagara Syailendra',place:'The Syailendra court',body:'The son of Suryaputradewa and the Song princess emerges as the dynastic successor. His rise shifts the narrative from the founder’s restoration toward an inheritable union.'},
    {date:'1072',title:'Royal Marriage of Syailendra–Thai',place:'Srivijaya and Tainagara',body:'Aryanagara marries into the royal house of Tainagara. The alliance binds maritime, Song and Thai frontier legitimacy before the Union of Suvarnabhumi.'}
  ]},
  {id:'first-union',date:'1072–1126',title:'First Union and Maritime Consolidation',events:[]},
  {id:'song-migration',date:'1127–1182',title:'Song Migration and Oceanic Expansion',events:[]},
  {id:'bhumi-hangus',date:'1183–1230',title:'Bhumi Hangus and Bharatanagara Conquest',events:[]},
  {id:'imperial-codification',date:'1231–1273',title:'Imperial Codification and Northern Migrations',events:[]},
  {id:'mandate-of-heaven',date:'1273–1306',title:'Mandate of Heaven Period',events:[]},
  {id:'kemaharajaan',date:'1307–1351',title:'Birth of Kemaharajaan',events:[history[1]]},
  {id:'eastern-renaissance',date:'1352–1460',title:'Eastern Renaissance: The Age of Peace and Tranquility',events:[history[2]]},
  {id:'oceanic-colonialism',date:'1460–1749',title:'Age of Oceanic Colonialism',events:[history[3],history[4]]},
  {id:'imperial-century',date:'1749–1850',title:'Maharajapura Imperial Century',events:[history[5]]},
  {id:'industrial-transformation',date:'1850–1945',title:'Industrial-Secular Transformation',events:[]},
  {id:'modern-suvarnabhumi',date:'1945–Present',title:'Modern Suvarnabhumi and the Global Mandala Order',events:[]}
];
export const characters = [
  {id:"suryaputradeva",name:"Suryaputradeva",role:"Maharaja of Srivijaya",period:"Reign dates pending canon",image:"https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1200&q=85",summary:"A ruler associated with the Srivijayan foundations of Suvarnabhumi.",details:"This profile is an editorial template. A verified portrait, genealogy and reign dates will be added from the imperial canon.",connections:["Srivijaya","Musi River"]},
  {id:"navasuvara",name:"Navasuvara",role:"Protector and dynastic unifier",period:"c. 1380",image:"https://images.unsplash.com/photo-1564399579888-c2cfb95497cb?w=1200&q=85",summary:"A figure in the protection, protectorate and dynastic union of Sukhothai.",details:"The established sequence is protection, protectorate and dynastic union around 1380. Other biographical details await a canon source.",connections:["Sukhothai","Imperial history"]}
];
export const regions = [
  {name:"Maharaja Mandala",kind:"Imperial heartland",description:"The historic heart of the empire and its ceremonial traditions."},
  {name:"Srivijaya",kind:"Special Administrative Region",description:"Sacred Musi River centre, distinct from the modern capital region."},
  {name:"Malaya Islands Capital Region",kind:"Capital region",description:"The island capital region centred on Maharajapura."},
  {name:"Nilabhumi",kind:"Mandala",description:"Brought into the imperial realm during the 1470–1478 conquest."},
  {name:"Utyanagara",kind:"Mandala",description:"The northern sphere associated with the shogunate allegiance of 1325."},
  {name:"Ratnadvipa",kind:"Mandala",description:"The oceanic sphere that includes Zanzibar."},
  {name:"Sinabhumi",kind:"Mandala",description:"Includes North China in the project canon."},
  {name:"Madhiterana",kind:"Mandala",description:"A trans-Mediterranean imperial region."}
];
