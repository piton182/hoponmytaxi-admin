import { Mongo } from 'meteor/mongo'

export const Rides = new Mongo.Collection('rides', {idGeneration: 'MONGO'})

export const Airports = new Mongo.Collection('airports', {idGeneration: 'MONGO'})
