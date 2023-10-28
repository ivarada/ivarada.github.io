/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
const labels = ["VA", "OH", "NC", "IL"];
let labelIndex = 0;

async function initMap() {
    // Request needed libraries.
    const {
        Map
    } = await google.maps.importLibrary("maps");
    const {
        AdvancedMarkerElement
    } = await google.maps.importLibrary("marker");
    const {
        LatLng
    } = await google.maps.importLibrary("core");
    const USA = new LatLng(38.5, -82.5);
    // create the map
    const map = new Map(document.getElementById("map"), {
        zoom: 7,
        center: USA,
        mapId: "4504f8b37365c3d0",
    });

    for (const property of properties) {
        const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
            map,
            content: buildContent(property),
            position: property.position,
            title: property.description,
        });

        AdvancedMarkerElement.addListener("click", () => {
            toggleHighlight(AdvancedMarkerElement, property);
        });
    }



    //Ashburn lat long
    const ASVA = {
        lat: 39.03,
        lng: -77.4
    };
    //Columbus lat long
    const COOH = {
        lat: 39.983334,
        lng: -82.983330
    };
    //Norwich lat long
    const NOCT = {
            lat: 41.5243,
            lng: -72.0759
        }
        //Kings Moutain lat long
    const KMNC = {
        lat: 35.2514091,
        lng: -81.3944095
    };
    //Downers Grove lat long
    const DGIL = {
        lat: 41.8265995,
        lng: -88.0261194
    };
    // Create the polyline and add the symbol via the 'icons' property.
    const line = new google.maps.Polyline({
        path: [ASVA, DGIL, KMNC, ASVA, COOH, DGIL, KMNC, COOH],
        strokeColor: "#0099CC", //sky blue color
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
    });
    // Add a marker at the center of the map.
    addMarker(ASVA, map, "Ashburn_VA");
    addMarker(COOH, map, "Columbus_OH");
    //addMarker(NOCT, map, "Norwich");
    addMarker(KMNC, map, "KingsMountain_NC");
    addMarker(DGIL, map, "DownersGrove_IL");

}
// Adds a marker to the map.
function addMarker(location, map, title) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    new google.maps.Marker({
        position: location,
        map: map,
        label: {
            text: labels[labelIndex++], // codepoint from https://fonts.google.com/icons
            fontFamily: "Material Icons",
            color: "#ffffff",
            fontSize: "14px",
        },
        title: title,
    });
}

function toggleHighlight(markerView, property) {
    if (markerView.content.classList.contains("highlight")) {
        markerView.content.classList.remove("highlight");
        markerView.zIndex = null;
    } else {
        markerView.content.classList.add("highlight");
        markerView.zIndex = 1;
    }
}

function buildContent(property) {
    const content = document.createElement("div");

    content.classList.add("property");
    content.innerHTML = `
    <div class="icon">
        <i aria-hidden="true" class="fa fa-icon fa-${property.type}" title="${property.type}"></i>
        <span class="fa-sr-only">${property.type}</span>
    </div>
    <div class="details">
        <div class="address">${property.address}</div>
        <div class="description">${property.description}</div>
    </div>
    `;
    return content;
}

const properties = [{
    address: "Ashburn, VA",
    description: "Brownfield, Goldfield",
    type: "cloud",
    position: {
        lat: 39.03,
        lng: -77.4
    },
}, {
    address: "Columbus, OH",
    description: "Brownfield, Goldfield",
    type: "cloud",
    position: {
        lat: 39.983334,
        lng: -82.983330
    },
}, {
    address: "Kings Mountain, NC",
    description: "Mainframe",
    type: "server",
    position: {
        lat: 35.2514091,
        lng: -81.3944095
    },
}, {
    address: "Dovers Grove, IL",
    description: "Mainframe",
    type: "server",
    position: {
        lat: 41.8265995,
        lng: -88.0261194
    },
}, ];

window.initMap = initMap;