const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], 
    keyspace: 'historical_data'
});
// const random = require('random-world');

// console.log(random.latlong());
module.exports = {
  getSurgeAndDrivers: (city, hoursPastMidnight, day) => {
      const query = `SELECT * FROM historical_data.aggregated_data where 
      city=? and day=? and time_interval=?`;
    return client.execute(query, [ city, day, hoursPastMidnight ], {prepare: true})
        .then(result => {
          // console.log('query', query);
          console.log('Success!');
          return result.rows;
        })
        .catch(error => console.log(error));
    }
  }