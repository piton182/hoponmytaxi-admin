import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'

import './ride-list.html';

import { Rides, Airports } from '../../../both/collections.js'

Template.ride_list.helpers({
  rides() {
    return Rides.find();
  },
  isThisRideBeingEdited() {
    const rideBeingEdited =  Session.get('rideBeingEdited');
    return rideBeingEdited ? this.name === rideBeingEdited.name : false;
  },
});

Template.ride_list.events({
  'click .js-edit-ride'(event, instance) {
    Session.set('rideBeingEdited', this);
  },
  'click .js-delete-ride'(event, instance) {
    instance.data.callbacks.deleteRide(this._id);
  }
});
