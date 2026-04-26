
let map;
let marker;
let circle;
let autocomplete;
let service;
let placeMarkers = [];

let centerLocation = null;
let currentRadius = 0;

function initMap() {
  console.log("Map initialized");

  const chennai = { lat: 13.0827, lng: 80.2707 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: chennai,
    zoom: 12,
  });

  service = new google.maps.places.PlacesService(map);

  // AUTOCOMPLETE (Google-like search)
  const input = document.getElementById("address");

  autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      alert("No details available");
      return;
    }

    centerLocation = place.geometry.location;

    map.setCenter(centerLocation);
    map.setZoom(14);

    if (marker) marker.setMap(null);

    marker = new google.maps.Marker({
      map: map,
      position: centerLocation,
    });
  });

  document.getElementById("drawBtn").addEventListener("click", drawRadius);
  document.getElementById("searchBtn").addEventListener("click", searchPlaces);
}

// Draw radius
function drawRadius() {
  const radiusKm = document.getElementById("radius").value;

  if (!centerLocation || !radiusKm) {
    alert("Select location and enter radius");
    return;
  }

  currentRadius = radiusKm * 1000;

  if (circle) circle.setMap(null);

  circle = new google.maps.Circle({
    map: map,
    center: centerLocation,
    radius: currentRadius,
    fillColor: "#FF0000",
    fillOpacity: 0.2,
    strokeColor: "#FF0000",
    strokeWeight: 2,
    clickable: false
  });

  map.fitBounds(circle.getBounds());
}

// Search inside radius
function searchPlaces() {
  const type = document.getElementById("type").value;

  if (!centerLocation || !currentRadius) {
    alert("Draw radius first");
    return;
  }

  // clear old markers
  placeMarkers.forEach(m => m.setMap(null));
  placeMarkers = [];

  const request = {
    location: centerLocation,
    radius: currentRadius,
    keyword: type,
    type: [type]
  };

  service.nearbySearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {

      results.forEach(place => {
        const placeLoc = place.geometry.location;

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          centerLocation,
          placeLoc
        );

        // ensure inside circle
        if (distance <= currentRadius) {
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
