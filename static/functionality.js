$(window).on('load', onLoad);

function onLoad() {
    $('#search').on('input', onUserType);
}

function onUserType() {
    $.get("/api/v1/search?mushroom_name=" + $('#search').val(), function (data) {
        // code will run after making the GET request.
        $(".search-results").empty();
        for (let item of data) {
            let photoName = "/static/generic_mushroom.svg";
            if (item['taxon']['default_photo']) {
                photoName = item['taxon']['default_photo']['square_url']
            }
            let commonName = "";
            if (item['taxon']['preferred_common_name']) {
                commonName = item['taxon']['preferred_common_name'];
            }
            let searchResult = $("<div class='search-result'>" +
                "<span><span>" + commonName + "</span><br/><span>(" + item['taxon']['name'] + ")</span></span>" +
                "  <img src='" + photoName + "' onerror='this.src=\"/static/generic_mushroom.svg\"' />" +
                "</div>");
            searchResult.click(function () {
                // This runs when user clicks on a result.
                window.location.href = "/map?taxon_id=" + item['taxon']['id'];
            });
            $(".search-results").append(searchResult)

        }
    })
}

