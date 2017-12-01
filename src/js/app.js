/**
 * @description initial locations data
 */
const locations = [
    {
        title: "Coliseum BART Station",
        location: {
            lat: 37.6916105,
            lng: -122.4062711,
        }
    },
    {
        title: "Montgomery St. Station",
        location: {
            lat: 37.7894069,
            lng: -122.40106730000002,
        }
    },
    {
        title: "Hayward Station",
        location: {
            lat: 37.66974459999999,
            lng: -122.08703300000002
        }
    },
    {
        title: "San Francisco International Airport Station",
        location: {
            lat: 37.6159629,
            lng: -122.3924154,
        }
    },
    {
        title: "Daly City BART Station",
        location: {
            lat: 37.7063632,
            lng: -122.4692604,
        }
    }
];

/**
 * @description define the app view model
 */
let AppViewModel = function () {
    let self = this;

    self.shouldShowNavigation = ko.observable(true);

    // Map data
    self.mapCenterLat = ko.observable('37.6916105');
    self.mapCenterLng = ko.observable('-122.4062711');
    self.mapZoom = ko.observable(8);
    self.locations = ko.observableArray(locations);

    /**
     * @description toggle navigation display
     */
    self.toggleNavigation = function () {
        self.shouldShowNavigation(!self.shouldShowNavigation());
    };

    /**
     * @description define map property for San Fransisco BART area
     */
    self.sfMap = ko.observable({
        zoom: 12,
        lat: 37.6916105,
        lng: -122.4062711
    });
};

/**
 * @description create custom bindings for google map
 */
ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindings) {
        // get the latest data for the map
        let value = valueAccessor();
        // check if there is no supplied model
        let valueUnwrapped = ko.unwrap(value);

        // define the variables for the map and its default value
        let zoom = allBindings.get('mapZoom') || 11;
        let lat = allBindings.get('mapCenterLat') || 37.6916105;
        let lng = allBindings.get('mapCenterLng') || -122.4062711;

        let options = {
            zoom: zoom,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // If no supplied model property is observable, loda the predefined map
        if (valueUnwrapped === true) {
            let map = new google.maps.Map(element, {
                zoom: 8,
                center: {lat: 37.6916105, lng: -122.4062711},
                mapTypeId: google.maps.MapTypeId.ROADMAP
            })

        // If there is model property that is observable, load map according to the latest data
        } else {
            let map = new google.maps.Map(element, options);
        }
    }
};


$(function () {
    let viewModel = new AppViewModel();
    ko.applyBindings(viewModel);
});