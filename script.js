let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.0827, lng: 80.2707 },
    zoom: 12
  });
}

function showLocation() {
  const address = document.getElementById("address").value;
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: address }, function(results, status) {
    if (status === "OK") {
      const location = results[0].geometry.location;

      map.setCenter(location);

      new google.maps.Marker({
        map: map,
        position: location
      });

      const circle = new google.maps.Circle({
        map: map,
        center: location,
        radius: 2000,
        fillColor: "#FF0000",
        fillOpacity: 0.3
      });

      map.fitBounds(circle.getBounds());
    } else {
      alert("Address not found");
    }
  });
}
