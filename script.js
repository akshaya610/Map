<script>
let map;
let geocoder;
let circle;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.0827, lng: 80.2707 }, // Chennai
    zoom: 12,
  });
  geocoder = new google.maps.Geocoder();
}

function drawRadius() {
  const address = document.getElementById("address").value;
  const radiusKm = document.getElementById("radius").value;

  if (!address || !radiusKm) {
    alert("Enter address and radius");
    return;
  }

  geocoder.geocode({ address: address }, function(results, status) {
    if (status === "OK") {
      const location = results[0].geometry.location;

      map.setCenter(location);

      new google.maps.Marker({
        map: map,
        position: location,
      });

      if (circle) {
        circle.setMap(null);
      }

      circle = new google.maps.Circle({
        map: map,
        center: location,
        radius: radiusKm * 1000, // km to meters
        fillColor: "#FF0000",
        fillOpacity: 0.2,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

    } else {
      alert("Geocode failed: " + status);
    }
  });
}

window.onload = initMap;
</script>
