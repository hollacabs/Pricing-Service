const koa = require('koa');
const moment = require('moment');
const Router = require('koa-router');
const calculator = require('../priceCalc.js');
const db = require('../database/redis-db.js');
const bodyParser = require('koa-bodyparser');
const coordinates = require('../data-generator/redis-city.js');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
const faker = require('faker');

var app = new koa();
var router = new Router(); 
const port = process.env.PORT || 3000;

router.use(bodyParser());
app.use(router.routes());

app.listen(port, () => {
  console.log('Koa is listening on port ' + port);
});

// Inputs are as below: 
// userId: Integer
// pickUpLocation: Array of integers [Long, Lat]
// dropOffLocation: Array of integers [Long, Lat]
// city: string
router.get('/fare', async (ctx) => {
  try {
    let city = faker.address.city;
    let availableDrivers = parseInt(await db.getAvailableDriversInACity(city));
    let priceTimestamp = moment().format('YYYY-MM-DD hh:mm:ssZ');
    let pickUp = coordinates.pickUpCoordinates();
    let dropOff = coordinates.dropOffCoordinates();
    let distance = calculator.getDistanceFromLatLonInKm(pickUp[0], pickUp[1], 
                                                        dropOff[0], dropOff[1]);
    let date = new Date();
    let hoursPastMidnight = date.getHours();
    let surge = 1;
    let surgeAndDrivers = await db.getSurgeAndDrivers(city, hoursPastMidnight);
    let avgSurge = parseFloat(surgeAndDrivers.avgSurge);
    let avgDrivers = parseInt(surgeAndDrivers.avgDrivers);
    let supplyRatio = availableDrivers/avgDrivers;
    if (supplyRatio > 0.7) {
      surge = 1;
    } else if (supplyRatio > 0.5 && supplyRatio <= 0.7) {
      surge = avgSurge;
    } else if (supplyRatio > 0.3 && supplyRatio <= 0.5) {
      avgSurge += avgSurge * .14;
      surge = parseFloat(avgSurge.toFixed(2));
    } else {
      avgSurge += (avgSurge * .23);
      surge = parseFloat(avgSurge.toFixed(2));
    }
    let rideFare = calculator.calculateRidefare(distance) * surge;
    ctx.status = 200;
    ctx.body = {
      price: parseFloat(rideFare.toFixed(2)),
      priceTimestamp: priceTimestamp,
      rideDuration: calculator.rideDuration(distance),
      surgeMultiplier: surge
    };
    // TODO: log event in event logger
  } catch (err) {
    console.log(err)
  }
});

// create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
  QueueName: 'eventLog',
  Attributes: {
    'DelaySeconds': '0',
    'MessageRetentionPeriod': '345600'
  }
};
sqs.createQueue(params, (err, data) => {
  if(err) {
    console.log(err);
  } else {
    console.log('created queue successfully');  
  }
});
