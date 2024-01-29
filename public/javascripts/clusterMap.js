// Initialize the map
// India coordinates: [20.5937, 78.9629]
const map = L.map('cluster-map').setView([20.5937, 78.9629], 5);

// Add the CartoDB Positron tile layer for a light map style
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © CartoDB'
}).addTo(map);

function getSizeBasedOnClusterSize(size) {
    // Adjust the size of the cluster icon based on the cluster size
    switch (size) {
        case 'small':
            return L.point(30, 30);
        case 'medium':
            return L.point(50, 50);
        case 'large':
            return L.point(70, 70);
        default:
            return L.point(40, 40); // Default size
    }
}

// Add a marker cluster group with custom options
const markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true, // Show individual markers when maximum zoom is reached
    showCoverageOnHover: false,
    disableClusteringAtZoom: 15, // Disable clustering at a certain zoom level
    iconCreateFunction: function (cluster) {
        // Customize the appearance of the cluster icon
        const count = cluster.getChildCount();
        const size = count < 10 ? 'small' : count < 30 ? 'medium' : 'large';
        const iconSize = getSizeBasedOnClusterSize(size);

        return L.divIcon({
            html: `<div style="line-height: ${iconSize.y}px;">${count}</div>`,// style is used to center the number inside the cluster
            className: `custom-cluster-icon cluster-${size}`,
            iconSize: getSizeBasedOnClusterSize(size) // Adjust the size of the cluster icon
        });
    }
});

campgrounds.forEach(function (feature) {
    feature.type = "Feature"; // Add type property to each feature
});

//convert campgrounds into a valid GeoJSON object
const geojson = {
    type: "FeatureCollection",
    features: campgrounds
};

const geojsonData = L.geoJson(geojson, {
    pointToLayer: function (feature) {
        const marker = L.marker(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));

        // Hover functionality
        marker.on('mouseover', function () {
            // Open the popup on hover
            this.bindPopup(feature.properties.popUpMarkup).openPopup();
        })

        // Close the popup when the cursor leaves the map
        map.on('mouseout', function () {
            marker.closePopup();
        });

        return marker;
    }
});

// Add GeoJSON layer to the MarkerClusterGroup
markers.addLayer(geojsonData);

// Add MarkerClusterGroup to the map
map.addLayer(markers);