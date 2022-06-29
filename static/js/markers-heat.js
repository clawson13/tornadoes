function heat() {
  // Access mongo data via flask route
  d3.json("/api/intensity").then(function(data){
    // console.log(data)
    // //List for lat, lon points for heat layer
    var alllatlong= [];
    // Variables for loop
    var latdata = data[0].Lat
    var londata = data[0].Lon
    var ids = data[0].PKID;
    //Loop through data to create list of lat lon points
    for (var i = 0; i < ids.length; i++) {
      //List with lat long point
      eachlatlong = [latdata[i], londata[i]];
      //List of lists for heatlayer
      alllatlong.push(eachlatlong);
    };
    //console.log(alllatlong);

    /////////Builidng the map
    //Base layer is grayscale
    var base = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    subdomains: 'abcd',
    minZoom: 0,
    ext: 'png'
    });
    // Topography layer
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    //Define map
    var myMap = L.map('map', {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [base]
    });
    // Create heatmap
    var heatmap = L.webGLHeatmap({
      alphaRange: 0.2,
      opacity: 0.8,
    });
    // Insert lat,lon data into the map
    heatmap.setData(alllatlong);
    // Add heat layer to map and decrease intensity so we can see the density more clearly
    myMap.addLayer( heatmap );
    heatmap.multiply(0.7);
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Grayscale": base,
      "Topography": topo,
      };
    // Define object to hold our overlay
    var overlayMaps = {
      "Heat Map": heatmap
      };
    // Create a layer control
    // Pass it our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

  });
};

heat();

