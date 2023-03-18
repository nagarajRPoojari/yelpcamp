/*mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  zoom: 13.1,
  center: campground.geometry.coordinates,
  pitch: 85,
  bearing: 80,
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y",
});

map.on("load", () => {
  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14,
  });
  // add the DEM source as a terrain layer with exaggerated height
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

  // add sky styling with `setFog` that will show when the map is highly pitched
  map.setFog({
    "horizon-blend": 0.3,
    color: "#f8f0e3",
    "high-color": "#add8e6",
    "space-color": "#d8f2ff",
    "star-intensity": 0.0,
  });
});*/

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v10", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${campground.title}</h5><p>${campground.location}</p>`
    )
  )
  .addTo(map);
