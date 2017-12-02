/**
 * @description initial locations data
 */
const locations = [
    {
        title: "Coliseum BART Station",
        location: {
            lat: 37.6916105,
            lng: -122.4062711,
        },
        isActive: ko.observable(false)
    },
    {
        title: "Montgomery St. Station",
        location: {
            lat: 37.7894069,
            lng: -122.40106730000002,
        },
        isActive: ko.observable(false)
    },
    {
        title: "Hayward Station",
        location: {
            lat: 37.66974459999999,
            lng: -122.08703300000002
        },
        isActive: ko.observable(false)
    },
    {
        title: "San Francisco International Airport Station",
        location: {
            lat: 37.6159629,
            lng: -122.3924154,
        },
        isActive: ko.observable(false)
    },
    {
        title: "Daly City BART Station",
        location: {
            lat: 37.7063632,
            lng: -122.4692604,
        },
        isActive: ko.observable(false)
    }
];

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
    self.locations = ko.observableArray(locations);

    self.bartMap = {zoom: 11, lat: 37.71, lng: -122.2913078};

    /**
     * @description toggle locations active status
     * @param location
     */
    self.toggleActive = function (location) {
        for (let location of locations) {
            location.isActive(false);
        }
        location.isActive(!location.isActive());
        console.log(location);
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


        /**
         * @description show markers and InfoWindow
         */
        let infoWindow = new google.maps.InfoWindow();

        for (let location of locations) {
            let marker = new google.maps.Marker({
                position: location.location,
                map: map,
                title: location.title
            });

            // Show marker on clicking
            marker.addListener('click', function () {
                infoWindow.close();
                infoWindow = new google.maps.InfoWindow({
                    content: location.title
                });
                infoWindow.open(map, marker);
            });
        }


    }
};


$(function () {
    let viewModel = new AppViewModel();
    ko.applyBindings(viewModel);
});