/**
 * @description define the model
 */

let AppViewModel = function () {
    let self = this;

    self.locations = ko.observableArray([
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
    ]);


};

function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {lat: 37.6916105, lng: -122.4062711}
    });
}


ko.applyBindings(new AppViewModel(

));