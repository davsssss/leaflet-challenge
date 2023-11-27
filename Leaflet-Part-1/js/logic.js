document.addEventListener("DOMContentLoaded", function () {
  var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
  }).addTo(myMap);

  function getEarthquakeData() {
    var url =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

    d3.json(url)
      .then(function (data) {
        processEarthquakeData(data.features);
        addLegend();
      })
      .catch(function (error) {
        console.error("Error fetching earthquake data:", error);
      });
  }

  function processEarthquakeData(features) {
    features.forEach(function (feature) {
      var lat = feature.geometry.coordinates[1];
      var lon = feature.geometry.coordinates[0];
      var mag = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];

      var color = getColor(depth);

      var marker = L.circleMarker([lat, lon], {
        radius: mag * 5,
        color: color,
        fillOpacity: 0.8,
      });

      marker.bindPopup(`Magnitude: ${mag}<br>Depth: ${depth} km`);

      marker.addTo(myMap);
    });
  }

  function getColor(depth) {
    return depth >= 90 ? "#004c6d" :
      depth < 90 && depth >= 70 ? "#346888" :
      depth < 70 && depth >= 50 ? "#5886a5" :
      depth < 50 && depth >= 30 ? "#7aa6c2" :
      depth < 30 && depth >= 10 ? "#9dc6e0" :
      "#c1e7ff";
  }

  function addLegend() {
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");
      var labels = [];
      var depthValues = [0, 10, 30, 50, 70, 90];

      div.innerHTML += "<h4>Depth Legend</h4>";
      for (var i = 0; i < depthValues.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getColor(depthValues[i] + 1) +
          '"></i> ' +
          depthValues[i] +
          (depthValues[i + 1] ? "&ndash;" + depthValues[i + 1] + " km<br>" : "+ km");
      }

      return div;
    };

    legend.addTo(myMap);
  }

  getEarthquakeData();
});