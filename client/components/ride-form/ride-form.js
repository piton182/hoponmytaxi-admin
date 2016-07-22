import { Template } from 'meteor/templating';
// import { ReactiveDict } from 'meteor/reactive-dict';

import './ride-form.html';

import { Airports } from '../../../both/collections.js'

Template.ride_form.onCreated(function() {
});

Template.ride_form.onRendered(function() {
  this.$('#my-datepicker').datepicker();
});

Template.ride_form.helpers({
  airports() {
    return Airports.find();
  },
  isAirportSelected(airport) {
    const model_airport = Template.currentData().model.to || {};
    return isMongoIdsEqual(model_airport._id, airport._id);
  }
});

Template.ride_form.events({
  'submit .form-ride'(event, instance) {
    // Prevent default browser form submit
    event.preventDefault();

    if (instance.data.isEditingMode) {
      // update
      // console.log('update')
      const newRide = {
        _id: instance.data.model._id,
        bkn_ref: instance.data.model.bkn_ref,

        name: event.target.name.value,
        phone: event.target.phone.value,
        datetime: {
          unix: moment(`${event.target.date.value}:${event.target.time_h.value}:${event.target.time_m.value}`, "MM/DD/YYYY:HH:mm").unix(),
        },
        from: event.target.from.value,
        to: event.target.to.value,
      }
      instance.data.callbacks.updateRide(newRide);
    } else {
      // new
      // console.log('new')
      const newRide = {
        name: event.target.name.value,
        phone: event.target.phone.value,
        datetime: {
          unix: moment(`${event.target.date.value}:${event.target.time_h.value}:${event.target.time_m.value}`, "MM/DD/YYYY:HH:mm").unix(),
        },
        from: event.target.from.value,
        to: event.target.to.value,
      }
      instance.data.callbacks.createRide(newRide);
    }

    { // clear all form fields
      event.target.name.value = null;
      event.target.phone.value = null;
      event.target.date.value = null;
      event.target.time_h.value = null;
      event.target.time_m.value = null;
      event.target.from.value = null;
      event.target.to.value = null;
    }
  },
  'click .js-cancel'(event, instance) {
    Session.set('rideBeingEdited', null);
  },
  'click .js-fake'(event, instance) {
    const randomAirport = Airports.findOne(); // TODO: always takes 1st airport; take random
    Session.set('rideBeingEdited', {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumberFormat(),
      datetime: {
        unix: moment(faker.date.recent()).unix(),
      },
      // date: moment(datetime).format("MM/DD/YYYY"),
      // time_h: s.pad(moment(datetime).hours(), 2, '0'),
      // time_m: s.pad(moment(datetime).minutes(), 2, '0'),
      from: faker.address.streetAddress(),
      to: {
        _id: randomAirport._id,
        name: randomAirport.name,
      },
    });
  },
  'click .js-clear'(event, instance) {
    Session.set('rideBeingEdited', null);
  }
});

function isMongoIdsEqual(id1, id2) {
  if (typeof id1 === typeof id2) {
    if (typeof id1 === 'string') {
      return id1 === id2;
    } else {
      return id1.equals(id2);
    }
  } else {
    return false;
  }
}
