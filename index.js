const express = require('express');
const app = express();
const PORT = 3001
const bodyParser = require('body-parser')
const MIN_RAND = 1;
const MAX_RAND = 1000000000;

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

app.get('/api/persons', (request, response) => {
  console.log(request.headers);
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
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  console.log(person);
  persons = persons.concat(person);
  console.log(persons.length);
  response.json(person);
});

const generateId = () => {
  return Math.floor(Math.random() * (MAX_RAND - MIN_RAND) + MIN_RAND);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
