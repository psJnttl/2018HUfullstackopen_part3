const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MIN_RAND = 1;
const MAX_RAND = 1000000000;
let morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('body', function (req, res) {
  let body = req.body ? req.body : {};
  return JSON.stringify(body);
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.body(req, res),
    'Status:', tokens.status(req, res), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}));

app.use(cors());

app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then((result) => {
      const formatted = result.map((person) => Person.formatPerson(person));
      response.json(formatted);
    })
    .catch(error => {
      console.log(error);
    });
});

app.get('/info', (request, response) => {
  Person
    .count({})
    .then(result => {
      const info = "Puhelinluettelossa on <strong>" + result +
                    "</strong> henkilön tiedot.<br />" + new Date();
      response.send(info);
    })
    .catch(err => {
      console.log("count err: ", err);
      const msg = 'Counting documents in collection failed: \n' + err;
      return response.status(400).send({ error: msg });
    });
});

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(result => {
      if (!result) {
        return response.status(404).end();
      }
      response.json(Person.formatPerson(result));
    })
    .catch(error => {
      console.log(error);
      return response.status(400).send({ error: 'malformatted id' });
    });
});

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(result => {
      if (!result) {
        return response.status(404).end();
      }
    })
    .catch(error => {
      return response.status(400).send({ error: 'malformatted id' });
    });
  Person
    .deleteOne({_id: request.params.id})
    .then(result => {
      return response.status(204).end();
    });
});

app.use(bodyParser.json());

app.post('/api/persons', (request, response) => {
  const body = request.body
  if ( !body.name || !body.number) {
    return response.status(400).json({error: 'name, number or both missing'})
  }

  Person
    .find({name: body.name})
    .then(result => {
      if (result.length !== 0) {
        return response.status(400).json({error: 'Name already exists!'});
      }
      const person = new Person({
        name: body.name,
        number: body.number
      });
      person
        .save()
        .then( result => {
          console.log("save result: ", result);
          const person = Person.formatPerson(result)
          response.append("Location", "/api/persons/" + person.id);
          response.status(201).json(person);
        });
    })
    .catch(error => {
      console.log(error);
    });

});

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  if ( !body.name || !body.number) {
    return response.status(400).json({error: 'name, number or both missing'})
  }
  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(result => {
      response.json(Person.formatPerson(result));
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: 'malformatted id' });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
