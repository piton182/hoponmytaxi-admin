import { Rides, Airports } from './collections.js';
import { Mongo } from 'meteor/mongo'

Meteor.methods(
  {
    'rides.create'(newRide) {
      // TODO: validate newRide

      { // doc enrichment
        // TODO: poor algorithm
        newRide.bkn_ref = 'R' + Math.floor(Math.random()*(100*1000)); // TODO: it should generate at the server (as method?)

        const airport = Airports.findOne({_id: newRide.to});
        newRide.to = {
          _id: airport._id,
          name: airport.name,
        }
      }

      Rides.insert(newRide);
    },
    'rides.delete'({ rideId }) {
      // TODO: validate ride

      Rides.remove(rideId);
    },
    'rides.update'(ride = { _id, bkn_ref }) {
      // TODO: validate ride

      { // doc enrichment
        const airport = Airports.findOne({_id: ride.to});
        ride.to = {
          _id: airport._id,
          name: airport.name,
        }
      }

      Rides.update({_id: ride._id}, ride);
    }
  },
);
