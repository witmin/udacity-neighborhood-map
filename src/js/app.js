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

let map;
let marker;
let markers = [];
let infowindow;

/**
 * Initialize google map
 */
function initialize() {
    let mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(37.71, -122.2913078),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    let mapElement = document.getElementById('map');

    map = new google.maps.Map(mapElement, mapOptions);

    // Init info window
    infowindow = new google.maps.InfoWindow({
        maxWidth: 320
    });

    // Hide opened infowindow on click
    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });

    // Show all markers with initial places data
    showAllMarkers(map, initialPlaces);
}

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
};

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
function showAllMarkers(map, places) {
    // Init markers
    markers = [];

    // Set marker for each place
    for (let i = 0; i < places.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(places[i].location),
            title: places[i].title,
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);
        marker.setMap(map);
    }

    // iterate markers
    for (let i = 0; i < markers.length; i++) {
        let marker = markers [i];
        markerEventListener(marker);
    }
}

function markerEventListener(marker) {
    (function (marker) {
        google.maps.event.addListener(marker, 'click', function (event) {
            populateInfoWindow(marker);
        });
    })(marker);
}

function populateInfoWindow(marker) {
    // Set marker to bounce once
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
        marker.setAnimation(null);
    }, 1200);
    //Populate infowindow
    infowindow.setContent(`<h4>${marker.title}</h4><div data-bind="html: htmlContent"`);
    infowindow.open(map, marker);
}

/**
 * @description delete markers and remove from makers array.
 */
function deleteMarkers() {
    clearMarkers();
    markers = [];
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
        // show infowindow on clicked place.
        populateInfoWindow(marker);
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
                }
            }
            // Show all markers with the filtered results
            // showAllMarkers(map, filterResults);
        }
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
        showAllMarkers(map, initialPlaces);
    }

    /**
     * @description get wiki content snippet and page url and show the page in info window
     * @param data
     */

    /**
     * @description fetch wikipedia API data for each place
     * API doc: https://www.mediawiki.org/wiki/API:Main_page
     */

    self.htmlContent = ko.observable('test');
    self.getWikiPage = function (title) {
        $.ajax({
            url: '//en.wikipedia.org/w/api.php',
            data: {action: 'query', list: 'search', srsearch: title, format: 'json'},
            dataType: 'jsonp'
        }).done(self.populateWikiContent)
            .fail(function (error) {
                self.requestError(error);
            });
    };

    self.populateWikiContent = function (data) {
        getWikiPage(marker.title);
        if (data) {
            let snippet = data.query.search[0].snippet;
            self.htmlContent(`<p>Relevant entry snippet on Wikipedia:</p><p class="snippet">${snippet}</p>`);

        } else {
            self.htmlContent('<div class="error-no-content">No wikipedia content available</div>');
        }
    };

    /**
     * @description show request error message
     * @param e
     */
    self.requestError = function (e) {
        console.log(e);
        htmlContent = '<div class="error-no-content">There is a problem with wikipedia request</div>';
    }
};

$(function () {

    let viewModel = new AppViewModel();
    ko.applyBindings(viewModel);

});

/**
 * Check if google Map API has been loaded properly. If not, popup an alert
 * @type {boolean}
 */

// TODO: set googleMapIsLoaded = false
let googleMapIsLoaded = true;
window.mapsCallback = function () {
    googleMapIsLoaded = true;
    initialize();
};

if (googleMapIsLoaded === false) {
    alert("There is a problem to load Google Map API.");
}