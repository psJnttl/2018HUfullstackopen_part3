const mongoose = require('mongoose');
const constants = require('../../constants');
const url = 'mongodb://' + constants.MLAB_USER + ':' + constants.MLAB_PASSWORD + '@ds237610.mlab.com:37610/fs2018_part3';

mongoose.connect(url);
const Person = mongoose.model('Person', {
  name: String,
  number: String
});

module.exports = Person;
