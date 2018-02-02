// Step 1: calculate distance using getDistanceFromLatLonInKm
// Step 2: calculate rideFare using calculateRidefare
// Note: fare doesn't include surge multiplier
const random = require('random-world');

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

module.exports = {
  getDistanceFromLatLonInKm: (lat1,lon1,lat2,lon2) => {
    // lat1, lon1, lat2, lon2 are randomly generated just for testing purposes.
    // in production, this will be coming from client
    var lat1 = random.lat();
    var lat2 = random.lat();
    var lon1 = random.long();
    var lon2 = random.long();
    var radius = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = radius * c; // Distance in km
    return d.toFixed(2);
  },

  calculateRidefare: (distance) => {
    var baseFare = 5;
    var fare = 0;
    if (distance <= 1) {
      return baseFare;
    } else if (distance > 1 && distance < 4) {
      fare = baseFare + 2 * distance; // $2/km 
    } else if (distance >=4 && distance < 8) {
      fare = baseFare + 1.8 * distance; // $1.7/km 
    } else if (distance >=8 && distance < 15) {
      fare = baseFare + 1.65 * distance; // $1.5/km 
    } else if (distance >=15 && distance < 25) {
      fare = baseFare + 1.4 * distance; // $1.7/km 
    } else if (distance >= 25) {
      fare = baseFare + 1.2 * distance; // $1.7/km 
    }
    return fare.toFixed(2);
  },

  // ride duration
  // currently, it takes 2 minutes/km (distance is calculated in kms)
  // for future: calculate real-time taken to travel from distance A to B
  rideDuration: (distance) => {
    return 2 * parseInt(distance);
  },

  // coordinates is an array of lat and long
  // getCityFromLatAndLong: (coordinates) => {
  //   // var city = '';
  //   console.log(coordinates);
  //   return new Promise(function(resolve, reject) {
  //     geocoder.reverseGeocode( coordinates[0], coordinates[1], function ( err, data ) {
  //       if (err) {
  //         console.log(err); 
  //         reject(err);
  //       } else {
  //         var city = data.results[0].formatted_address.split(',');
  //         resolve(city[1]);
  //       }
  //     });
  //   });
  // }
}
