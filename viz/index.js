
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvdHl1a2F2aW4iLCJhIjoiY2l3YzFrcGF2MDA0czJ5cTdtbWYxY3hoOSJ9.27RqchNskV797X9k_SG0BQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/geotyukavin/cjlgvlt4t046t2so6gl6cwh28',
  center: [-73.97, 40.74], 
  zoom: 10
});


map.on('load', () => {
  map.addSource('zones', {
    type: 'geojson',
    data: "https://raw.githubusercontent.com/andreytyu/taxi-test/master/zones_with_counts.geojson",
  });

  map.addSource('points', {
    type: 'geojson',
    data: "https://raw.githubusercontent.com/andreytyu/taxi-test/master/sample_pnts.geojson",
  });

  map.addLayer({
    id: 'zones',
    type: 'fill',
    source: 'zones',
    paint: {
      'fill-color': '#548FFF',
      'fill-opacity': 0.05,
      'fill-antialias': false
    }
  },'waterway-label');

})
