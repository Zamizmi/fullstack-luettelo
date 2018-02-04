const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

const personSchema = new Schema({
  name:  String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

//palauttaa arrayn
/*
personSchema.statics.findByName = function(name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb)
}

personSchema.statics.format = function search (person, cb) {
  return this.where('person', new RegExp(person, 'i')).exec(cb);
}

personSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}
*/

module.exports = Person
