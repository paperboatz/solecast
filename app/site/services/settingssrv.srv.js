(function(){ 
    angular
        .module('weatherApp')
        .service('SettingSrv', SettingSrv);

    function SettingSrv() { 
        var local = this;

        local.hours = '12';
        local.zip = '';
        local.latLong = '';
        local.conversion = 'celsius';

        local.ChangeHour = function (updatingHours){
            local.hours = updatingHours;
        }

        local.ChangeZip = function (updatingZip, updatingLatLong){
            local.zip = updatingZip;
            local.latLong = updatingLatLong;
            console.log(local.latLong);
        }

        local.ChangeTemp = function (updatingConversion){
            local.conversion = updatingConversion;
        }

        console.log('this is localzip:' + local.zip);
    } // eo locationSrv

})();
