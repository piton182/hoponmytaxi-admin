import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

import { Rides } from '../both/collections.js'

Template.registerHelper('rideModel', () => {
  const rideBeingEdited = Session.get('rideBeingEdited');
  if (rideBeingEdited) {
    const datetime = moment.unix(rideBeingEdited.datetime.unix)
    rideBeingEdited.date = datetime.format('MM/DD/YYYY');
    rideBeingEdited.time_h = datetime.hours();
    rideBeingEdited.time_m = datetime.minutes();
    return rideBeingEdited;
  } else {
    return { };
  }
});

Template.registerHelper('formatDate', (unix) => {
  return moment.unix(unix).format("MM/DD/YYYY HH:mm");
});

Template.registerHelper('rideCRUDCallbacks', () => {
  return {
    createRide(ride) {
      // console.log('create')
      Meteor.call('rides.create', ride,
        (err, res) => {
          if (err) {
            // TODO: do not know how alert the end user yet
          } else { /* success! */ }
        }
      );
      Session.set('rideBeingEdited', null);
    },
    updateRide(ride) {
      // console.log('update')
      Meteor.call('rides.update', ride);
      Session.set('rideBeingEdited', null);
    },
    deleteRide(rideId) {
      Meteor.call('rides.delete', { rideId }/*, no callback*/);
    },
  }
});

Template.registerHelper('isRideFormEditingMode', () => {
  const rideBeingEdited = Session.get('rideBeingEdited') || {};
  return rideBeingEdited._id ? true : false;
});
