const mongoose = require('mongoose');
const constants = require('../../constants');
const url = 'mongodb://' + constants.MLAB_USER + ':' + constants.MLAB_PASSWORD + '@ds237610.mlab.com:37610/fs2018_part3';

mongoose.connect(url);
const PersonSchema = new mongoose.Schema({
  name: String,
  number: String
});
PersonSchema.statics.formatPerson = (person) => {
  return {
    id: person._id,
    name: person.name,
    number: person.number
  }
}

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
