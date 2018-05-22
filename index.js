const express = require('express');
const app = express();
const PORT = 3001
const bodyParser = require('body-parser');
const MIN_RAND = 1;
const MAX_RAND = 1000000000;
let morgan = require('morgan');
const cors = require('cors');

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
];

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

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const info = "Puhelinluettelossa on <strong>" + persons.length +
                "</strong> henkilön tiedot.<br />" + new Date();
  response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => {
    return p.id === id;
  });
  if (!person) {
    return response.status(404).end();
  }
  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => {
    return p.id === id;
  });
  if (!person) {
    return response.status(404).end();
  }
  persons = persons.filter((p) => {
    return p.id !== id;
  })
  return response.status(204).end();
});

app.use(bodyParser.json());

app.post('/api/persons', (request, response) => {
  const body = request.body
  if ( !body.name || !body.number) {
    return response.status(400).json({error: 'name, number or both missing'})
  }
  const duplicate = persons.find((p) => {
    return body.name === p.name;
  });
  if (duplicate) {
    return response.status(400).json({ error: 'name must be unique' });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person);
  response.append("Location", "/api/persons/" + person.id);
  response.status(201).json(person);
});

const generateId = () => {
  return Math.floor(Math.random() * (MAX_RAND - MIN_RAND) + MIN_RAND);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
