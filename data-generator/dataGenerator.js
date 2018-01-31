var redis = require("redis");
var client = redis.createClient();

client.on('connect', function() {
  // console.log('connected via koa');
}).select(3, function() { 
  aggregatedData();
  availableDriversPerCityData()
});

var cities = [
  'sanFrancisco', 'seattle', 'omaha', 'lasVegas', 'newYork',
  'portland', 'austin', 'losAngeles', 'chicago', 'phoenix',
  'philadelphia', 'sanAntonio', 'sanDiego', 'dallas', 'sanJose',
  'jacksonville', 'columbus', 'indianapolis', 'fortWorth', 'charlotte',
  'denver', 'elPaso', 'washingtonDC', 'boston', 'detroit', 'nashville',
  'memphis', 'oklahomaCity', 'louisville', 'baltimore',
]
var aggregatedData = function() {
  for (var i = 0; i < cities.length; i++ ) {
    var city = cities[i];
    for (var j = 0; j < 24; j++) {
      var avgSurge = parseFloat((Math.random() * (3.0 - 1.0) + 1.0).toFixed(1));
      var avgDrivers = parseInt(Math.floor(Math.random() * (65 - 0) + 0));
      client.hmset(`${city}:${j}`, 'avgSurge', avgSurge, 'avgDrivers', avgDrivers, function(err, reply) {
        if (err) {
          console.log(err);
        } 
      });
    }
  }
}

var availableDriversPerCityData = function() {
  for (var i = 0; i < cities.length; i++ ) {
    var city = cities[i];
    var availableDrivers = Math.floor(Math.random() * 50) + 1;
    client.hset('city', `${city}`, availableDrivers, function(err, reply) {
      if (err) {
        console.log(err);
      } else {
        console.log('city', `${city}`, availableDrivers);
      }
    });
  }
}
