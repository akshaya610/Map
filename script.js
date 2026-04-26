
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
//get icons
function getIcon(type) {
  const icons = {
    restaurant: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    hospital: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    pharmacy: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    temple: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    school: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    store: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
  };

  return icons[type] || null;
}

// Search inside radius
function searchPlaces() {

  if (!centerLocation || !currentRadius) {
    alert("Draw radius first");
    return;
  }

  placeMarkers.forEach(m => m.setMap(null));
  placeMarkers = [];

  const categories = [
    "restaurant",
    "hospital",
    "pharmacy",
    "temple",
    "school",
    "store"
  ];

  const uniquePlaces = new Map();

  categories.forEach(category => {

    const request = {
      location: centerLocation,
      radius: currentRadius,
      keyword: category
    };

    service.nearbySearch(request, function(results, status, pagination) {

      if (status === google.maps.places.PlacesServiceStatus.OK) {

        results.forEach(place => {

          const placeLoc = place.geometry.location;

          // 🔥 STRICT FILTER (inside circle only)
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            centerLocation,
            placeLoc
          );

          if (distance <= currentRadius) {

            if (!uniquePlaces.has(place.place_id)) {
              uniquePlaces.set(place.place_id, place);

              const marker = new google.maps.Marker({
                map: map,
                position: placeLoc,
                title: place.name,
                icon: getIcon(category)
              });

              placeMarkers.push(marker);
            }

          }

        });

        // pagination (more results)
        if (pagination && pagination.hasNextPage) {
          setTimeout(() => pagination.nextPage(), 1500);
        }
      }

    });

  });
}
window.initMap = initMap;
}
