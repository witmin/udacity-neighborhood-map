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
let marker;

let Place = function (data) {
    this.title = ko.observable(data.title.toString());
    this.location = ko.observable(data.location);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.isActive = ko.observable(data.isActive);

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.location),
        title: data.title,
        animation: google.maps.Animation.DROP
    });
    markers.push(marker);

    infowindow = new google.maps.InfoWindow();

    // Show marker on clicking
    marker.addListener('click', function () {
        populateInfoWindow(marker, infowindow);
    });
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
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
}

/**
 * @description add a marker to the markers array
 * @param data
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
 * @description Removes the markers from the map
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
            populateInfoWindow(marker, infowindow);
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
     * @description define the map data value for BART
     * @type locations Array
     * @type {{zoom: number, lat: number, lng: number}}
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

        console.log(context.$index());

        // get the clicked place marker data
        let marker = markers[context.$index()];
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1400);

        // show marker info window on clicked place
        populateInfoWindow(marker, infowindow);
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
     * @description filter places
     */
    self.keyword = ko.observable("");

    self.filterPlaces = function () {
        deleteMarkers();
        // Reset the list if keyword is empty
        if (self.keyword() === "") {
            self.initPlaces();
                        showAllMarkers(self.map);

        } else {
            let filterResults = [];
            // compare string and update the list
            for (let i = 0, len = self.places().length; i < len; ++i) {
                let title = self.places()[i].title().toString();
                let lowerTitle = self.places()[i].title().toString().toLowerCase();
                let keyword = self.keyword().toString().toLowerCase();
                let result = lowerTitle.includes(keyword);
                // console.log(result);
                // If the item includes the keyword, show it in the results
                if (result === true) {
                    filterResults.push(self.places()[i]);
                    let location = self.places()[i].location();
                    addMarker(title, location);
                }
            }

            self.deletePlaces();

            filterResults.forEach(function (place) {
                self.places.push(place);
                console.log(place);
            });

            showAllMarkers(self.map);
            console.log(markers);
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
        showAllMarkers(self.map);
    }

};


$(function () {
    let viewModel = new AppViewModel();
    ko.applyBindings(viewModel);
});