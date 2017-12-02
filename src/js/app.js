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

let Place = function (data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.isActive = ko.observable(data.isActive);

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.location.lat, data.location.lng),
        title: data.title
    });

    infowindow = new google.maps.InfoWindow();

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
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
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
     * @description define map options
     * @type {{zoom: number, lat: number, lng: number}}
     */
    self.mapOptions = {zoom: 8, lat: 37.71, lng: -122.2913078};

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
    }
};

/**
 * @description create custom bindings for google map
 */
ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindings) {
        // get the latest data for the map
        let value = valueAccessor();
        let valueUnwrapped = ko.unwrap(value);

        // define default value for the map options
        let zoom = allBindings.get('mapZoom') || 11;
        let lat = allBindings.get('mapCenterLat') || 37.7271784;
        let lng = allBindings.get('mapCenterLng') || -122.2913078;

        let options = {
            zoom: zoom,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // If map value is defined, load the latest data value
        if (valueUnwrapped !== undefined) {
            options = {
                zoom: value.zoom,
                center: new google.maps.LatLng(value.lat, value.lng),
            };
        }

        // Create map
        let map = new google.maps.Map(element, options);

        // Show markers
        let bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        markers.forEach(function (marker) {
            marker.setMap(map);
            bounds.extend(marker.position);
        });

        map.fitBounds(bounds);


    }
};


$(function () {
    let viewModel = new AppViewModel();
    ko.applyBindings(viewModel);
});