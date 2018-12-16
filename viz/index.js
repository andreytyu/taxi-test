
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvdHl1a2F2aW4iLCJhIjoiY2l3YzFrcGF2MDA0czJ5cTdtbWYxY3hoOSJ9.27RqchNskV797X9k_SG0BQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/geotyukavin/cjpr63fyh0iv62rnlh51fw4ce',
  center: [-73.97, 40.74], 
  zoom: 12
});


map.on('load', () => {
  map.addSource('zones', {
    type: 'geojson',
    data: "https://raw.githubusercontent.com/andreytyu/taxi-test/master/data/zones_with_counts.geojson",
  });

  map.addSource('points', {
    type: 'geojson',
    data: "https://raw.githubusercontent.com/andreytyu/taxi-test/master/data/sample_pnts.geojson",
  });

  map.addLayer({
    id: 'zones',
    type: 'fill',
    source: 'zones',
    layout: {
      visibility: "none",
    },
    paint: {
      'fill-color': {
        property: 'count',
        stops: [
          [0.0, 'rgb(255,255,178)'],
          [269940.0, 'rgb(254,217,118)'],
          [787068.0, 'rgb(254,178,76)'],
          [1360958.0, 'rgb(253,141,60)'],
          [1918844.0, 'rgb(240,59,32)'],
          [2500998.0, 'rgb(189,0,38)']
        ]
    },
      'fill-opacity': 0.5,
      'fill-antialias': true,
      'fill-outline-color': 'white'
    }
  },'waterway-label');

        




  map.addLayer({
    id: 'points-heat',
    type: 'heatmap',
    source: 'points',
    layout: {
      visibility: "none",
    },
    maxzoom: 15,
    paint: {
      
      // increase weight as diameter breast height increases
      'heatmap-weight': {
        property: 'count',
        type: 'exponential',
        stops: [
          [0.01, 0.0],
          [0.25, 0.2],
          [0.5, 0.4],
          [0.75, 0.6],
          [1, 0.8]
        ]
      },
      // increase intensity as zoom level increases
      'heatmap-intensity': {
        stops: [
          [11, 1],
          [15, 5]
        ]
      },

      // assign color values be applied to points depending on their density
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0.01, 'rgba(255,255,178,0)',
        0.25, 'rgb(254,217,118)',
        0.5, 'rgb(254,178,76)',
        0.75, 'rgb(240,59,32)',
        1, 'rgb(189,0,38)'
      ],



      // increase radius as zoom increases
      'heatmap-radius': {
        stops: [
          [0, 1],
          [1, 3]
        ]
      },
      // decrease opacity to transition into the circle layer
      'heatmap-opacity': {
        default: 1,
        stops: [
          [14, 1],
          [15, 0]
        ]
      },
    }
  });



  map.addLayer({
    id: 'points-point',
    type: 'circle',
    source: 'points',
    minzoom: 14,
    paint: {
      // increase the radius of the circle as the zoom level and dbh value increases
      'circle-radius': {
        property: 'zoom',
        type: 'exponential',
        stops: [
          [{ zoom: 15, value: 1 }, 5],
          [{ zoom: 15, value: 40 }, 10],
          [{ zoom: 22, value: 1 }, 20],
          [{ zoom: 22, value: 40 }, 50],
        ]
      },
      'circle-color': 'rgb(189,0,38)',
      'circle-stroke-color': 'white',
      'circle-stroke-width': 0.15,
      'circle-opacity': {
        stops: [
          [14, 0],
          [15, 1]
        ]
      }
    }
  }, 'waterway-label');
  


toggleLayer('1', ['zones'], 'Choropleth');
toggleLayer('2', ['points-heat'], 'Heatmap');




 function toggleLayer(id, ids, name) {
        var button = document.createElement('a');
        button.textContent = name;
        //console.log(id);
        
        button.onclick = function (e) {

          for (layers in ids) {
            var visibility = map.getLayoutProperty(ids[layers], 'visibility');
            if (visibility === 'visible') {
              map.setLayoutProperty(ids[layers], 'visibility', 'none');
              this.className = '';
              
            } else {
              this.className = 'active';
              map.setLayoutProperty(ids[layers], 'visibility', 'visible');
              
            }
          }
        };
        var layers = document.getElementById('menu');
        layers.appendChild(button);
  };



  map.on('click', 'zones', function (e) {

    var coordinates = turf.centroid(e.features[0].geometry).geometry.coordinates.slice();
    var description =e.features[0].properties.zone
    var description2 =e.features[0].properties.count
    
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description + '<br/> trip_count: ' + description2)
      .addTo(map);
  });


  map.on('mouseenter', 'zones', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  
     
  map.on('mouseleave', 'zones', function () {
  map.getCanvas().style.cursor = '';
  });



})
