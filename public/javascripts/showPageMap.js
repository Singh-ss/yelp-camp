// Extract coordinates passed from the server
const lat = campground.geometry.coordinates[1];
const lng = campground.geometry.coordinates[0];

// Initialize the map
const map = L.map('map').setView([lat, lng], 13);

// Add a marker at the specified coordinates
const marker = L.marker([lat, lng]).addTo(map)
    .bindPopup(`<h3>${campground.title}</h3><p>${campground.location}</p>`, { closeButton: false })

// Add the CartoDB Positron tile layer for a light map style
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CartoDB'
}).addTo(map);

// Open the popup when the cursor is over the marker
marker.on('mouseover', function () {
    this.openPopup();
});

// Close the popup when the cursor leaves the map
map.on('mouseout', function () {
    marker.closePopup();
});
