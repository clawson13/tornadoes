  // Initialize the necessary LayerGroups
let layers = {
  markers: new L.LayerGroup()
};
  
// Create the base layers
let grayScale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  subdomains: 'abcd',
  minZoom: 0,
  ext: 'png'
});

let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Define a baseMaps object to hold our base layers
let baseMaps = {
    "Grayscale" : grayScale,
    "Street" : streetMap,
    "Topographic" : topoMap
    };

// Create an overlay object to hold our overlay
let overlayMaps = {
  "Tornado Paths": layers.markers
};

// Create our map, giving it the satellite base and earthquake/plates layers to display on load
let map = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [grayScale, layers.markers]
});

// Create a layer control
// Pass it our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);

// Set data source for tornadoes data
const queryUrl = "/api/intensity"

let resultCount = null

// Set date selector at load
function init(){
  // Code that runs once (only on page load or refresh)
  // Fetch the JSON data and console log it to confirm retrieval

  d3.json(queryUrl).then(function(data2) {

      data = []

      for(let i=0; i<data2[0].Azimuth.length; i++){
        let dict = {
          "MXDV": data2[0].MXDV[i],
          "zTime": data2[0].zTime[i],
          "Azimuth": data2[0].Azimuth[i],
          "Lat": data2[0].Lat[i],
          "Lon": data2[0].Lon[i]
         };
        data.push(dict);
      }

      const groups = data.reduce((groups, cell) => {
        const date = cell.zTime.split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(cell);
        return groups;
      }, {});
    
      // Edit: to add it in the array format instead
      const dateCells = Object.keys(groups).map((date) => {
        return {
          date,
          cells: groups[date]
        };
      });
    
      // Populate the dropdown menu with the available dates
      let date_select = d3.select('#selDataset');
      for(let i=0; i<dateCells.length; i++){
          date_select.append("option")
          .text(dateCells[i].date)
          .attr("value", dateCells[i].date)
      }
      
      let dropdownValue = dateCells[0].date
      let results = dateCells.filter(i=> i.date == dropdownValue) 

      // Create the slidebar
      let recordCt = results[0].cells.length

      let begin = results[0].cells[0].zTime
      let end = results[0].cells[recordCt - 1].zTime
    
      function timestamp(str) {
        return new Date(str).getTime();
      }
      let calc = timestamp(begin)

      let startRange = new Date(begin).setUTCHours( 0,0,0,0 );

    
      let endRange = new Date(begin).setUTCHours( 24,00,00,00 );
    
      var dateSlider = document.getElementById('slider-date');

      noUiSlider.create(dateSlider, {
          connect: true,
          start: [ timestamp(startRange) ],
          step: 60 * 60 * 1000,
          range: {
              min: timestamp(startRange),
              max: timestamp(endRange)
          },
          pips: {
            mode: 'steps',
            density: 3,
            format: {
              // 'to' the formatted value. Receives a number.
              to: function (value) {
                  return Math.floor((value / (1000 * 60 * 60)) % 24) + ':00';
              }
            }
           }});

      cellData = results[0].cells
      results = cellData.filter(i=> timestamp(i.zTime) <= timestamp(endRange)).filter(i=> timestamp(i.zTime) >= timestamp(startRange));

      createMap(results);
    });
}

// Function called, runs init instructions
// Runs only on load and refresh of browser page
init();

// Function that runs whenever the dropdown is changed
function optionChanged(newDate){
  layers.markers.clearLayers();

  // code that updates graphics
  d3.json(queryUrl).then(function(data2) {

    data = []

    for(let i=0; i<data2[0].Azimuth.length; i++){
      let dict = {
        "MXDV": data2[0].MXDV[i],
        "zTime": data2[0].zTime[i],
        "Azimuth": data2[0].Azimuth[i],
        "Lat": data2[0].Lat[i],
        "Lon": data2[0].Lon[i]
       };
      data.push(dict);
    }

    const groups = data.reduce((groups, cell) => {
      const date = cell.zTime.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(cell);
      return groups;
    }, {});
  
    // Edit: to add it in the array format instead
    const dateCells = Object.keys(groups).map((date) => {
      return {
        date,
        cells: groups[date]
      };
    });
  

  let dropdownValue = newDate;
  let results = dateCells.filter(i=> i.date == dropdownValue)
  let resultCount = results[0].cells.length

  var dateSlider = document.getElementById('slider-date');


  function timestamp(str) {
    return new Date(str).getTime();
  }
  let startRange = new Date(dropdownValue).setUTCHours( 0,0,0,0 );

  let endRange = new Date(dropdownValue).setUTCHours( 24,00,00,00 );

  dateSlider.noUiSlider.updateOptions({
    start: [ timestamp(startRange) ],
    range: {
        min: timestamp(startRange),
        max: timestamp(endRange)
    },
  });


  cellData = results[0].cells
  results = cellData.filter(i=> timestamp(i.zTime) >= timestamp(startRange)).filter(i=> timestamp(i.zTime) <= timestamp(endRange));

  createMap(results);
}
)};

// Update the slider on change
document.getElementById('slider-date').addEventListener('click', function () {
  layers.markers.clearLayers();
  
  var dateSlider = document.getElementById('slider-date');
  let newBegin = dateSlider.noUiSlider.get();

  d3.json(queryUrl).then(function(data2) {

    data = []

    for(let i=0; i<data2[0].Azimuth.length; i++){
      let dict = {
        "MXDV": data2[0].MXDV[i],
        "zTime": data2[0].zTime[i],
        "Azimuth": data2[0].Azimuth[i],
        "Lat": data2[0].Lat[i],
        "Lon": data2[0].Lon[i]
       };
      data.push(dict);
    }
    
    const groups = data.reduce((groups, cell) => {
      const date = cell.zTime.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(cell);
      return groups;
    }, {});
  
    // Edit: to add it in the array format instead
    const dateCells = Object.keys(groups).map((date) => {
      return {
        date,
        cells: groups[date]
      };
    });

    let dropdownValue = document.getElementById('selDataset').value
    let results = dateCells.filter(i=> i.date == dropdownValue) 
  
    function timestamp(str) {
      return new Date(str).getTime();
    }

    let startRange = new Date(dropdownValue).setUTCHours( 0,0,0,0 );

    cellData = results[0].cells
    results = cellData.filter(i=> timestamp(i.zTime) >= timestamp(startRange)).filter(i=> timestamp(i.zTime) <= newBegin);

    createMap(results);
});
});


function createMap(results){

for (var i = 0; i < results.length; i++) {

    if (results[i].Azimuth < 180){
      var twister180Icon = L.icon({
        iconUrl: '../../static/img/twister.png',
        iconSize:     [24, 36] 
      })
      let direction = results[i].Azimuth;

      let point = L.marker(L.latLng(results[i].Lat, results[i].Lon), {
        icon: twister180Icon,
        rotationAngle: direction,
        rotationOrigin: "center center"
      });
      point.bindPopup("<h3>" + results[i].Shape +
      "</h3><hr><p> <b>Date/Time: </b>" + results[i].zTime + "</p>" +
      "<p> <b>Direction (degrees):</b> " + results[i].Azimuth + "; <b>MXDV:</b> " + results[i].MXDV + "</p>");

      point.addTo(layers.markers); 
    }
    else {
      var twister360Icon = L.icon({
        iconUrl: '../../static/img/twister-flip.png',
        iconSize:     [24, 36]
      })
      let direction = results[i].Azimuth;

      let point = L.marker(L.latLng(results[i].Lat, results[i].Lon), {
        icon: twister360Icon,
        rotationAngle: direction,
        rotationOrigin: "center center"
      });
      point.bindPopup("<h3>" + results[i].Shape +
      "</h3><hr><p> <b>Date/Time: </b>" + results[i].zTime + "</p>" +
      "<p> <b>Direction (degrees):</b> " + results[i].Azimuth + "; <b>MXDV:</b> " + results[i].MXDV + "</p>");

      point.addTo(layers.markers); 
    };
};
}
// };

// tracking();


