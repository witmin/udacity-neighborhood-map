/**
 * @description initial locations data
 */
const initialPlaces = [
    {
        title: "Coliseum BART Station",
        location: {
            lat: 37.6916105,
            lng: -122.4062711,
        },
        isActive: false
    },
    {
        title: "Montgomery St. Station",
        location: {
            lat: 37.7894069,
            lng: -122.40106730000002,
        },
        isActive: false
    },
    {
        title: "Hayward Station",
        location: {
            lat: 37.66974459999999,
            lng: -122.08703300000002,
        },
        isActive: false
    },
    {
        title: "San Francisco International Airport Station",
        location: {
            lat: 37.6159629,
            lng: -122.3924154,
        },
        isActive: false
    },
    {
        title: "Daly City BART Station",
        location: {
            lat: 37.7063632,
            lng: -122.4692604,
        },
        isActive: false
    }
];

let markers = [];
let infowindow;
/**
 * @description set the Place object
 * @param data
 * @constructor
 */
let Place = function (data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.isActive = ko.observable(data.isActive);

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.location.lat, data.location.lng),
        title: data.title,
        animation: google.maps.Animation.DROP
    });

    infowindow = new google.maps.InfoWindow({
        maxWidth: 320
    });

    // Show marker on clicking
    marker.addListener('click', function () {
        populateInfoWindow(marker, infowindow);
    });

    markers.push(marker);
};

/**
 * @description populate info window for a marker
 * @param marker
 * @param infowindow
 */
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
        infowindow.marker = marker;
        getWikiPage(marker.title);
        infowindow.setContent(`<h2 class="marker-title">${marker.title}</h2><div id="info-content"></div>
<div id="response-container"></div>`);

        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
}

/**
 * @description add a marker to the markers array
 * @param title {String}, location {object}
 */
function addMarker(title, location) {
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(location),
        title: title,
        animation: google.maps.Animation.DROP
    });
    markers.push(marker);
}

/**
 * @description Hide markers from the map
 */
function clearMarkers() {
    showAllMarkers(null);
}

/**
 * @description Set all markers on the map
 * @param map
 */
function showAllMarkers(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        markers[i].addListener('click', function () {
            populateInfoWindow(markers[i], infowindow);
        });
    }
}

/**
 * @description delete markers and remove from makers array.
 */
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

const responseContainer = document.querySelector('#response-container');

/**
 * @description fetch wikipedia API data for each place
 * API doc: https://www.mediawiki.org/wiki/API:Main_page
 */
function getWikiPage(title) {
    $.ajax({
        url: '//en.wikipedia.org/w/api.php',
        data: {action: 'query', list: 'search', srsearch: title, format: 'json'},
        dataType: 'jsonp',
        success: function (data) {
            // console.log(data);
        }
    }).done(populateWikiContent)
        .fail(function (error) {
            requestError(error);
        });
}

/**
 * @description get wiki content snippet and page url and show the page in info window
 * @param data
 */
function populateWikiContent(data) {
    let htmlContent = '';
    let contentWrapper = document.querySelector("#info-content");
    if (data) {
        let snippet = data.query.search[0].snippet;

        htmlContent = `<p>Relevant entry snippet on Wikipedia:</p><p class="snippet">${snippet}</p>`;

    } else {
        htmlContent = '<div class="error-no-content">No wikipedia content available</div>';
    }

    contentWrapper.insertAdjacentHTML('beforeEnd', htmlContent);
}

/**
 * @description show request error message
 * @param e
 */
function requestError(e) {
    console.log(e);
    responseContainer.insertAdjacentHTML('beforeEnd', `<p class="network-warning error"> There was an error to make the request.</p>`);
}

/**
 * @description define the app view model
 */
let AppViewModel = function () {
    let self = this;

    self.shouldShowNavigation = ko.observable(true);

    /**
     * @description toggle navigation display
     */
    self.toggleNavigation = function () {
        self.shouldShowNavigation(!self.shouldShowNavigation());
    };
    /**
     * @description add places to observableArray to init tha app
     */
    self.places = ko.observableArray([]);

    initialPlaces.forEach(function (place) {
        self.places.push(new Place(place));
    });

    /**
     * @description Initialise the map
     * @type {{zoom: number, lat: number, lng: number}}
     */
    self.mapOptions = {zoom: 8, lat: 37.71, lng: -122.2913078};

    self.options = {
        zoom: 11,
        center: new google.maps.LatLng(37.71, -122.2913078),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    self.mapElement = document.getElementById('map');
    self.map = new google.maps.Map(self.mapElement, self.options);

    showAllMarkers(self.map);

    /**
     * @description toggle places active status
     * @param clickedPlace
     */
    self.setActivePlace = function (clickedPlace, event) {
        for (let i = 0, len = self.places().length; i < len; ++i) {
            let place = self.places()[i];
            place.isActive(false);
        }

        clickedPlace.isActive(true);
        let context = ko.contextFor(event.target);

        // get the clicked place marker data
        let marker = markers[context.$index()];
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // Make the marker bounce once
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1400);

        // show marker info window on clicked place
        populateInfoWindow(marker, infowindow);
    };

    /**
     * @description reset places with initial data
     */
    self.initPlaces = function () {
        self.resetPlacesStatus();
        self.places.removeAll();
        initialPlaces.forEach(function (place) {
            self.places.push(new Place(place));
        });
    };
    /**
     * @description reset all places status to inactive
     */
    self.resetPlacesStatus = function () {
        for (let i = 0, len = self.places().length; i < len; ++i) {
            let place = self.places()[i];
            place.isActive(false);
        }
    };

    /**
     * @description delete places data from the array
     */
    self.deletePlaces = function () {
        self.places.removeAll();
    };


    /**
     * @description filter places with the keyword input
     */
    self.keyword = ko.observable("");

    self.filterPlaces = function () {
        deleteMarkers();
        // Reset the list and markers if keyword is empty
        if (self.keyword() === "") {
            self.initPlaces();
        } else {
            let filterResults = [];
            // compare string and update the list
            for (let i = 0, len = self.places().length; i < len; ++i) {
                let title = self.places()[i].title().toString();
                let placeTitle = title.toLowerCase();
                let keyword = self.keyword().toString().toLowerCase();

                // If the item includes the keyword, add the place to results array and add marker
                if (placeTitle.includes(keyword)) {
                    filterResults.push(self.places()[i]);
                    addMarker(title, self.places()[i].location());
                }
            }
            // Reset the self.places data with the filtered results
            self.deletePlaces();
            filterResults.forEach(function (place) {
                self.places.push(place);
                console.log(place);
            });
        }
        // Show all markers with the filtered results
        showAllMarkers(self.map);
    };

    /**
     * @description reset filter
     */
    self.resetFilter = function () {
        // delete markers
        deleteMarkers();
        // reset keyword
        self.keyword("");
        // Init Places
        self.initPlaces();
        // reset markers
        showAllMarkers(self.map);
    }
};

$(function () {
    let viewModel = new AppViewModel();
    ko.applyBindings(viewModel);
});