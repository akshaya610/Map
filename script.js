let map;
let marker;
let circle;
let autocomplete;
let service;
let placeMarkers = [];

function initMap() {
  const chennai = { lat: 13.0827, lng: 80.2707 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: chennai,
    zoom: 12,
  });

  service = new google.maps.places.PlacesService(map);

  // Autocomplete (Requirement 1)
  const input = document.getElementById("address");
  autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      alert("No details available");
      return;
    }

    const location = place.geometry.location;

    map.setCenter(location);
    map.setZoom(14);

    if (marker) marker.setMap(null);

    marker = new google.maps.Marker({
      map: map,
      position: location,
    });
  });

  document.getElementById("searchBtn").addEventListener("click", searchPlaces);
}

function searchPlaces() {
  const radiusKm = document.getElementById("radius").value;
  const type = document.getElementById("type").value;

  if (!marker || !radiusKm) {
    alert("Select location and radius");
    return;
  }

  const location = marker.getPosition();

  // Draw circle (Requirement 2 & 3)
  if (circle) circle.setMap(null);

  circle = new google.maps.Circle({
    map: map,
    center: location,
    radius: radiusKm * 1000,
    fillColor: "#FF0000",
    fillOpacity: 0.2,
    strokeColor: "#FF0000",
    strokeWeight: 2,
  });

  // Clear old markers
  placeMarkers.forEach(m => m.setMap(null));
  placeMarkers = [];

  // Search inside radius (Requirement 4 & 5)
  const request = {
    location: location,
    radius: radiusKm * 1000,
    type: [type] // filter
  };

  service.nearbySearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {

      results.forEach(place => {
        const placeLoc = place.geometry.location;

        // Extra strict filter inside circle
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          location,
          placeLoc
        );

        if (distance <= radiusKm * 1000) {

          const m = new google.maps.Marker({
            map: map,
            position: placeLoc,
            title: place.name
          });

          placeMarkers.push(m);
        }
      });

    } else {
      alert("No results found");
    }
  });
}


