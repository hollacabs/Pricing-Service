const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const calculator = require('../priceCalc.js');
const db = require('../database/cassandra-db.js');
const random = require('random-world');
const moment = require('moment');
const faker = require('faker');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
var queueUrl = 'https://sqs.us-west-1.amazonaws.com/344911669843/eventLog';

let app = new Koa();
var router = new Router(); 
const port = process.env.PORT || 3000;

router.use(bodyParser());
app.use(router.routes());

app.listen(port, () => {
  console.log('Koa is listening on port ' + port);
});

router.get('/price', async(ctx) => {
  try {
    let city = faker.address.city();
    // TODO: will be used in conjunction with the DTS redis
    // let availableDrivers = parseInt(await db.getAvailableDriversInACity(city));
    let availableDrivers = Math.floor(Math.random() * 60);
    let priceTimestamp = moment().format('YYYY-MM-DD hh:mm:ssZ');
    let pickUp = random.latlong();
    let dropOff = random.latlong();
    let distance = calculator.getDistanceFromLatLonInKm(pickUp.lat, pickUp.long, 
                                                        dropOff.lat, dropOff.long);
    let date = new Date();
    let hoursPastMidnight = date.getHours();
    let surge = 1;
    let day = Math.floor(Math.random() * 31);
    console.log('arguments: ', [city, hoursPastMidnight, day]);
    let surgeAndDrivers = await db.getSurgeAndDrivers(city, hoursPastMidnight, day);
    let avgSurge = parseFloat(surgeAndDrivers[0].avg_surge);
    let avgDrivers = parseInt(surgeAndDrivers[0].avg_drivers);
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
    // log event in event logger
    var message = {
      userId: 2461, // will come from user 
      surgeMultiplier: surge,
      price: parseFloat(rideFare.toFixed(2)),
      pickUpLocation: pickUp,
      dropOffLocation: dropOff,
      priceTimestamp: priceTimestamp
    };
    sendMessage(message, queueUrl);
  } catch (err) {
    console.log(err)
  }
});

// create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// var params = {
//   QueueName: 'eventLog',
//   Attributes: {
//     'DelaySeconds': '0',
//     'MessageRetentionPeriod': '345600'
//   }
// };
// sqs.createQueue(params, (err, data) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('created queue successfully');  
//   }
// });

// Sending a message
var sendMessage = (msgBody, queueUrl) => {
  var params = {
    MessageBody: JSON.stringify(msgBody),
    QueueUrl: queueUrl,
    DelaySeconds: 0
  };
  sqs.sendMessage(params, function(err, data) {
    if(err) {
      console.log(err);
    }
    else {
      console.log('message sent successfully! ', data);
    }
  });
};

