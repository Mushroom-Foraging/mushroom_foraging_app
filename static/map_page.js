$(window).on('load', onLoad);

function onLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const taxon_id = urlParams.get('taxon_id');
    if (taxon_id != null && taxon_id !== "") {
        getObservations(taxon_id, 42.506682, -71.097164);
    } else {
        getObservations_withoutID(42.506682, -71.097164);
    }

    console.log(taxon_id)
}

function getObservations(taxon_id, lat, lng) {
    $.get("/api/v1/locations?taxon_id=" + taxon_id + "&lat=" + lat + "&lng=" + lng, function (data) {
        console.log(data);
        plotMushroomMarkers(data)
    })
}

function getObservations_withoutID(lat, lng) {
    const mushroom_and_lichens = 47169;
    getObservations(mushroom_and_lichens, lat, lng);
}

function plotMushroomMarkers(observations) {
    for (let item of observations) {
        let url = "/static/generic_mushroom.svg";
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
    console.log(observation);
    if (observation['photos'].length > 0) {
        $(".mushroom_image").attr("src", observation['photos'][0].replace('square', 'large'));
    }
    $("#mushroom_title").text(observation['preferred_common_name']);
    $("#mushroom_scientific").text(observation['name']);
    $("#mushroom_address").text(observation['name']);

    let url = observation['wikipedia_url'];
    if (url != null) {
        let splitUrl = url.split('/');
        let id = splitUrl[splitUrl.length - 1];

        $('.circular').show();
        $("#mushroom_description").hide();

        $.get("/api/v1/summary?id=" + id, function (data) {
            $('.circular').hide();
            $("#mushroom_description").show();
            $("#mushroom_description").text(data);
        });
    }

    $(".btn-directions").unbind('click');
    $(".btn-directions").click(function () {
        let lng = observation["coordinates"][0];
        let lat = observation["coordinates"][1];
        console.log("Going to: " + observation["coordinates"]);
        window.open("https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng, '_blank');
    });
}

let map;

// Used, don't delete. Called from map.html
// noinspection JSUnusedGlobalSymbols
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