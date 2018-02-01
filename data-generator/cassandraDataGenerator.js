const cassandra = require('cassandra-driver');
const faker = require('faker');
const fs = require('fs');
const file = fs.createWriteStream('../file4.txt');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], 
    keyspace: 'historical_data'
});

client.connect((err) => {
  if(err) {
    console.log('Error connecting to Cassandra', err);
  } else {
    console.log('Connection successful');
  }
});

var aggregatedData = () => {
  var timeInterval = Math.floor(Math.random() * 24);
  var day = Math.floor(Math.random() * 30);
  var city = faker.address.city();
  var avgSurge = parseFloat((Math.random() * (3.0 - 1.0) + 1.0).toFixed(1));
  var avgDrivers = parseInt(Math.floor(Math.random() * (65 - 0) + 0));
  var queryStr = `INSERT INTO aggregated_data (day, time_interval, city, avg_drivers, avg_surge)
                  VALUES (?, ?, ?, ?, ?)`;
  var params = [day, timeInterval, city, avgDrivers, avgSurge];
  return params;
}

var generateBulkData = function(quantity) {
  for (let i = 0; i < quantity; i++) {
    file.write(aggregatedData() + '\n');    
  }    
}

// generateBulkData(2000000);