
mapboxgl.accessToken = 'pk.eyJ1IjoibGVuYWVtYXlhIiwiYSI6ImNpa3VhbXE5ZjAwMXB3eG00ajVyc2J6ZTIifQ.kmZ4yVcNrupl4H8EonM3aQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/lenaemaya/cjnwzrci100a32ro9ukssqg83',
  center: [37.62723840, 55.8291615], 
  zoom: 13,
  minZoom: 9
});



map.on('load', () => {
  
  map.addSource('zones', {
    type: 'geojson',
    data: "https://github.com/andreytyu/taxi-test/blob/master/zones_with_counts.geojson",
  });
  
  map.addSource('points', {
    type: 'geojson',
    data: "https://github.com/andreytyu/taxi-test/blob/master/sample_pnts.geojson",
  });    
  
  
})
  