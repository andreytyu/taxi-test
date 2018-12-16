
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
    
  map.addLayer({
    id: 'population',
    type: 'fill',
    source: 'zones',
    layout: {
      visibility: "none",
    },
    paint: {
      'fill-color':  [ 
                    "step", 
                    [ 
                        "get", 
                        "sumpopulat"
                    ], 
                    "#ffc34d", 
                    11, 
                    "#ff4916", 
                    23, 
                    "#de0032", 
                    49, 
                    "#a70070", 
                    146, 
                    "#630070"
                ]
    }
  },'park-border-2');

  map.addLayer({
    id: "ridership_budni",
    type: "circle",
    filter: [
    "all",
    [
      "in",
      "$type",
      "Polygon",
      "LineString",
      "Point"
    ],
    [
      "all",
      ["!in", "ridership", 0],
      ["in", "g_day", 0],
      ["in", "g_hour", -1]
    ]
  ],
    source: "ridership",
    layout: {
      visibility: "none",
    },
    paint: {
      "circle-color" : "#5D2BE3",
      "circle-opacity": 0.4,
      "circle-stroke-color" : "#5D2BE3",
      "circle-stroke-opacity": 0.5,
      "circle-stroke-width" : [ 
          "interpolate", 
          [ 
              "linear"
          ], 
          [ 
              "zoom"
          ], 
          10, 
          0.1, 
          14, 
          0.5
      ],
      'circle-radius': [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        [
          "interpolate",
          ["linear"],
          ["get", "ridership"],
          0,
          3,
          8079,
          25
        ],
        22,
        [
          "interpolate",
          ["linear"],
          ["get", "ridership"],
          0,
          6,
          8079,
          45
        ]
      ]
    }
  });


toggleLayer('1', ['zones'], 'Зоны');
toggleLayer('2', ['points'], 'Точки');




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
 

map.on('click', 'poi-all-1', function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();

  if (e.features[0].properties.name === undefined || e.features[0].properties.name === null) {
    var description =e.features[0].properties.type
  } else {
    var description =e.features[0].properties.name
  }
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});

map.on('mouseenter', 'zones', function () {
  map.getCanvas().style.cursor = 'pointer';
});

   
map.on('mouseleave', 'zones', function () {
map.getCanvas().style.cursor = '';
});
