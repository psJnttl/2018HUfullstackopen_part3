const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const url = process.env.FS18_PART3_MLAB_DB;
console.log(url);
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
