const mongoose = require('mongoose');
const constants = require('../constants');
const url = 'mongodb://' + constants.MLAB_USER + ':' + constants.MLAB_PASSWORD + '@ds237610.mlab.com:37610/fs2018_part3';

mongoose.connect(url);
const Person = mongoose.model('Person', {
  name: String,
  number: String
});
if (process.argv.length == 2) {
  Person
    .find({})
    .then((response) => {
      console.log("puhelinluettelo:");
      response.forEach((p) => {
        console.log(p.name," ", p.number);
      });
      mongoose.connection.close();
    });
}
else if (process.argv.length == 4) {
  const nimi = process.argv[2];
  const numero = process.argv[3]
  const person = new Person({
    name: nimi,
    number: numero
  });
  console.log("Lisätään henkilö ", nimi, " numero ", numero, " luetteloon.");
  person
    .save()
    .then( (result) => {
      console.log("Lisäys onnistui.");
      mongoose.connection.close();
    })
    .catch(error => {
      console.log(error);
    });
}
else {
  console.log("Väärä määrä parametrejä.");
  mongoose.connection.close();
}
