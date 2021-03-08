$(window).on('load', onLoad);

function onLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const taxon_id = urlParams.get('taxon_id');
    getObservations(taxon_id, 42.506682, -71.097164)
    getObservations_withoutID(42.506682, -71.097164)
    console.log(taxon_id)
}

function getObservations(taxon_id, lat, lng) {
    $.get("/api/v1/locations?taxon_id=" + taxon_id + "&lat=" + lat + "&lng=" + lng, function (data) {
        console.log(data);
        plotMushroomMarkers(data)
    })
}

function getObservations_withoutID(lat, lng) {
    $.get("/api/v1/locations?&lat=" + lat + "&lng=" + lng, function (data) {
        console.log(data);
        plotMushroomMarkers(data)
    })
}

function plotMushroomMarkers(observations) {
    for (let item of observations) {
        var url = "/static/generic_mushroom.svg";
        if (item['photos'].length > 0) {
            url = item['photos'][0];
        }
        const image = {
            url: url,
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        let marker = new google.maps.Marker({
            position: {lat: item["coordinates"][1], lng: item["coordinates"][0]},
            icon: image,
            map: map,
        });
        marker.addListener("click", () => {
            populateDetails(item);
        });
    }
}

function populateDetails(observation) {
    $(".mushroom_image").attr("src", observation['photos'][0].replace('square', 'large'));
}

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 42.506682, lng: -71.097164},
        zoom: 12,
        mapId: '55dfd65b84060eeb'
    });
    new google.maps.Marker({
        position: {lat: 42.506682, lng: -71.097164},
        map: map,
    });
}